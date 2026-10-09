import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import ts from 'typescript';
import {
  manifestKey,
  type Manifest,
  type ManifestComponent,
  type ManifestControl,
  type ManifestCssToken,
  type ManifestInput,
  type ManifestPage,
  type ManifestToken,
} from './manifest-types.ts';

/**
 * Gera o manifesto do catálogo lendo o código com a API do compilador
 * TypeScript: o código é a fonte da verdade, então a documentação não envelhece.
 */

export interface ManifestOptions {
  /** Raiz do repositório; caminhos no manifesto ficam relativos a ela. */
  root: string;
  /** Arquivos `*.docs.ts`, absolutos. */
  docsFiles: string[];
  /** Conteúdo de tokens/semantic.css. */
  semanticCss: string;
}

export class ManifestError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
    this.name = 'ManifestError';
  }
}

const COMPILER_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.Preserve,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  experimentalDecorators: true,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
};

export function buildManifest(options: ManifestOptions): Manifest {
  const program = ts.createProgram(options.docsFiles, COMPILER_OPTIONS);
  const reader = new ManifestReader(program.getTypeChecker(), options.root);
  const pages: Record<string, ManifestPage> = {};
  for (const file of [...options.docsFiles].sort()) {
    const source = program.getSourceFile(file);
    if (!source) {
      throw new ManifestError(file, 'arquivo não encontrado');
    }
    for (const page of reader.readDocsFile(source)) {
      pages[manifestKey(page.category, page.slug)] = page;
    }
  }
  return { pages, tokens: parseSemanticTokens(options.semanticCss) };
}

class ManifestReader {
  private readonly checker: ts.TypeChecker;
  private readonly root: string;

  constructor(checker: ts.TypeChecker, root: string) {
    this.checker = checker;
    this.root = root;
  }

  /** Cada `export const X: DocPage = { ... }` do arquivo vira uma página. */
  readDocsFile(source: ts.SourceFile): ManifestPage[] {
    return docPageDeclarations(source).map(({ page }) => this.readPage(page, source));
  }

  /** Componentes e diretivas exportados por um arquivo de API pública. */
  exportedComponents(source: ts.SourceFile): ts.ClassDeclaration[] {
    const module = this.checker.getSymbolAtLocation(source);
    if (!module) return [];
    const classes = new Set<ts.ClassDeclaration>();
    for (let symbol of this.checker.getExportsOfModule(module)) {
      if (symbol.flags & ts.SymbolFlags.Alias) {
        symbol = this.checker.getAliasedSymbol(symbol);
      }
      const declaration = symbol.declarations?.find(ts.isClassDeclaration);
      const isAbstract = declaration?.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.AbstractKeyword,
      );
      if (declaration && angularDecorator(declaration) && !isAbstract) {
        classes.add(declaration);
      }
    }
    return [...classes];
  }

  /** Inputs da classe e das classes base; a declaração mais próxima vence. */
  inputsOf(declaration: ts.ClassDeclaration): ManifestInput[] {
    const inputs = new Map<string, ManifestInput>();
    for (let current = declaration as ts.ClassDeclaration | undefined; current;) {
      for (const input of current.members.flatMap((member) => this.readInput(member))) {
        if (!inputs.has(input.name)) inputs.set(input.name, input);
      }
      current = this.baseClassOf(current);
    }
    return [...inputs.values()];
  }

  private baseClassOf(declaration: ts.ClassDeclaration): ts.ClassDeclaration | undefined {
    const extendsClause = declaration.heritageClauses?.find(
      (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
    );
    const base = extendsClause?.types[0]?.expression;
    if (!base) return undefined;
    let symbol = this.checker.getSymbolAtLocation(base);
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
      symbol = this.checker.getAliasedSymbol(symbol);
    }
    return symbol?.declarations?.find(ts.isClassDeclaration);
  }

  private readPage(page: ts.ObjectLiteralExpression, source: ts.SourceFile): ManifestPage {
    const file = this.relative(source.fileName);
    const slug = readString(page, 'slug', file);
    const component = property(page, 'component');
    return {
      slug,
      category: readString(page, 'category', file),
      file,
      component: component ? this.readComponent(component, slug, file) : undefined,
      examples: this.readExamples(page, file),
    };
  }

  private readExamples(page: ts.ObjectLiteralExpression, file: string): Record<string, string> {
    const examples: Record<string, string> = {};
    const list = property(page, 'examples');
    if (!list || !ts.isArrayLiteralExpression(list)) {
      throw new ManifestError(file, 'examples precisa ser uma lista');
    }
    for (const item of list.elements) {
      if (!ts.isObjectLiteralExpression(item)) {
        throw new ManifestError(file, 'cada exemplo precisa ser um objeto { name, component }');
      }
      const name = readString(item, 'name', file);
      const component = property(item, 'component');
      if (!component) {
        throw new ManifestError(file, `o exemplo "${name}" não tem component`);
      }
      examples[name] = this.classOf(component, file).getSourceFile().getFullText();
    }
    return examples;
  }

  private readComponent(
    expression: ts.Expression,
    slug: string,
    docsFile: string,
  ): ManifestComponent {
    const declaration = this.classOf(expression, docsFile);
    const source = declaration.getSourceFile();
    const decorator = componentDecorator(declaration);
    const file = this.relative(source.fileName);
    const css = (decorator ? styleUrls(decorator) : [])
      .map((url) => readFileSync(resolve(dirname(source.fileName), url), 'utf8'))
      .join('\n');
    return {
      className: declaration.name?.text ?? '',
      selector: (decorator && stringProperty(decorator, 'selector')) ?? '',
      file,
      inputs: this.inputsOf(declaration),
      cssTokens: componentCssTokens(css, slug),
    };
  }

  private readInput(member: ts.ClassElement): ManifestInput[] {
    if (!ts.isPropertyDeclaration(member) || !member.initializer) return [];
    const init = member.initializer;
    if (!ts.isCallExpression(init)) return [];
    const callee = init.expression.getText();
    if (callee !== 'input' && callee !== 'input.required') return [];

    const symbol = this.checker.getSymbolAtLocation(member.name);
    const signal = this.checker.getTypeAtLocation(member.name);
    const value = signal.getCallSignatures()[0]?.getReturnType();
    const description = symbol
      ? ts.displayPartsToString(symbol.getDocumentationComment(this.checker)).trim()
      : '';
    const required = callee === 'input.required';
    return [
      {
        name: member.name.getText(),
        ...describeType(this.checker, value),
        defaultValue: required ? undefined : init.arguments[0]?.getText(),
        required,
        description,
      },
    ];
  }

  /** A declaração da classe referida por um identificador importado. */
  private classOf(expression: ts.Expression, file: string): ts.ClassDeclaration {
    let symbol = this.checker.getSymbolAtLocation(expression);
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
      symbol = this.checker.getAliasedSymbol(symbol);
    }
    const declaration = symbol?.declarations?.find(ts.isClassDeclaration);
    if (!declaration) {
      throw new ManifestError(file, `"${expression.getText()}" não é uma classe importada`);
    }
    return declaration;
  }

  relative(file: string): string {
    return relative(this.root, file).replace(/\\/g, '/');
  }
}

/** As declarações `const X: DocPage = { ... }` de um arquivo `*.docs.ts`. */
function docPageDeclarations(
  source: ts.SourceFile,
): { name: string; page: ts.ObjectLiteralExpression }[] {
  const pages: { name: string; page: ts.ObjectLiteralExpression }[] = [];
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      const init = declaration.initializer;
      if (declaration.type?.getText() === 'DocPage' && init && ts.isObjectLiteralExpression(init)) {
        pages.push({ name: declaration.name.getText(), page: init });
      }
    }
  }
  return pages;
}

function property(object: ts.ObjectLiteralExpression, name: string): ts.Expression | undefined {
  for (const prop of object.properties) {
    if (ts.isPropertyAssignment(prop) && prop.name.getText() === name) {
      return prop.initializer;
    }
  }
  return undefined;
}

function stringProperty(object: ts.ObjectLiteralExpression, name: string): string | undefined {
  const value = property(object, name);
  return value && ts.isStringLiteralLike(value) ? value.text : undefined;
}

function readString(object: ts.ObjectLiteralExpression, name: string, file: string): string {
  const value = stringProperty(object, name);
  if (value === undefined) {
    throw new ManifestError(file, `${name} precisa ser um texto literal`);
  }
  return value;
}

/** Arquivos de estilo do componente: `styleUrl` ou a lista `styleUrls`. */
function styleUrls(decorator: ts.ObjectLiteralExpression): string[] {
  const single = stringProperty(decorator, 'styleUrl');
  if (single) return [single];
  const list = property(decorator, 'styleUrls');
  if (!list || !ts.isArrayLiteralExpression(list)) return [];
  return list.elements.filter(ts.isStringLiteralLike).map((element) => element.text);
}

/** `Component` ou `Directive`, quando a classe tem um desses decorators. */
function angularDecorator(declaration: ts.ClassDeclaration): string | undefined {
  for (const decorator of ts.getDecorators(declaration) ?? []) {
    const call = decorator.expression;
    const name = ts.isCallExpression(call) ? call.expression.getText() : undefined;
    if (name === 'Component' || name === 'Directive') return name;
  }
  return undefined;
}

function componentDecorator(
  declaration: ts.ClassDeclaration,
): ts.ObjectLiteralExpression | undefined {
  for (const decorator of ts.getDecorators(declaration) ?? []) {
    const call = decorator.expression;
    if (ts.isCallExpression(call) && call.expression.getText() === 'Component') {
      const [config] = call.arguments;
      return config && ts.isObjectLiteralExpression(config) ? config : undefined;
    }
  }
  return undefined;
}

/** Tipo exibido e controle do playground, a partir do `T` de `InputSignal<T>`. */
export function describeType(
  checker: ts.TypeChecker,
  type: ts.Type | undefined,
): { type: string; control: ManifestControl; options?: string[] } {
  if (!type) return { type: 'unknown', control: 'other' };
  const parts = (type.isUnion() ? type.types : [type]).filter(
    (part) => !(part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
  );
  const optional = parts.length !== (type.isUnion() ? type.types.length : 1) ? ' | undefined' : '';

  if (parts.length && parts.every((part) => part.isStringLiteral())) {
    const options = parts.map((part) => (part as ts.StringLiteralType).value);
    return {
      type: options.map((option) => `'${option}'`).join(' | ') + optional,
      control: 'options',
      options,
    };
  }
  if (parts.length && parts.every((part) => part.flags & ts.TypeFlags.BooleanLike)) {
    return { type: 'boolean' + optional, control: 'boolean' };
  }
  const single = parts.length === 1 ? parts[0].flags : 0;
  const text = checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation);
  if (single & ts.TypeFlags.String) return { type: text, control: 'string' };
  if (single & ts.TypeFlags.Number) return { type: text, control: 'number' };
  return { type: text, control: 'other' };
}

const DECLARATION = /(--arg-[\w-]+)\s*:\s*([^;]+);/g;

function collapse(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\(\s/g, '(').replace(/\s\)/g, ')').trim();
}

/** Comentários podem citar tokens como exemplo de uso; não são declarações. */
function stripComments(css: string, keepSingleLine = false): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    keepSingleLine && !comment.includes('\n') ? comment : '',
  );
}

/** Tokens `--arg-<slug>-*` declarados no CSS do componente, na ordem, sem repetir. */
export function componentCssTokens(css: string, slug: string): ManifestCssToken[] {
  const seen = new Map<string, string>();
  for (const [, name, value] of stripComments(css).matchAll(DECLARATION)) {
    if (name.startsWith(`--arg-${slug}-`) && !seen.has(name)) {
      seen.set(name, collapse(value));
    }
  }
  return Array.from(seen, ([name, value]) => ({ name, value }));
}

/**
 * Tokens semânticos do `:root`, agrupados pelo comentário de uma linha acima
 * deles ("Marca", "Texto"). Redefinições posteriores (media queries) são ignoradas.
 */
export function parseSemanticTokens(css: string): ManifestToken[] {
  const tokens: ManifestToken[] = [];
  const seen = new Set<string>();
  let group = '';
  const source = stripComments(css, true);
  for (const match of source.matchAll(/\/\*([^\n]*?)\*\/|(--arg-[\w-]+)\s*:\s*([^;]+);/g)) {
    const [, comment, name, value] = match;
    if (comment !== undefined) {
      group = comment.split(':')[0].trim();
    } else if (!seen.has(name)) {
      seen.add(name);
      tokens.push({ name, value: collapse(value), group });
    }
  }
  return tokens;
}

export interface CatalogCheckOptions {
  root: string;
  /** O `public-api.ts` da biblioteca, absoluto. */
  publicApi: string;
  /** Arquivos `*.docs.ts`, absolutos. */
  docsFiles: string[];
  /** O registro de páginas do catálogo, absoluto. */
  registryFile: string;
}

/**
 * Confere que o catálogo acompanha a biblioteca. Devolve um problema por
 * linha; lista vazia quando está tudo certo.
 *
 * - todo componente exportado tem página (ou está no mesmo arquivo de um que
 *   tem, como ArgListItem junto de ArgList);
 * - toda input de componente exportado tem JSDoc;
 * - toda página `*.docs.ts` está no registro do catálogo.
 */
export function checkCatalog(options: CatalogCheckOptions): string[] {
  const program = ts.createProgram([options.publicApi, ...options.docsFiles], COMPILER_OPTIONS);
  const reader = new ManifestReader(program.getTypeChecker(), options.root);
  const registry = reader.relative(options.registryFile);
  const problems: string[] = [];

  const documented = new Set<string>();
  const registered = registeredPages(readFileSync(options.registryFile, 'utf8'));
  for (const file of [...options.docsFiles].sort()) {
    const source = program.getSourceFile(file);
    if (!source) throw new ManifestError(file, 'arquivo não encontrado');
    for (const page of reader.readDocsFile(source)) {
      if (page.component) documented.add(page.component.file);
    }
    for (const { name } of docPageDeclarations(source)) {
      if (!registered.has(name)) {
        problems.push(
          `${name} (${reader.relative(file)}) não está no registro: inclua em ${registry}`,
        );
      }
    }
  }

  const publicApi = program.getSourceFile(options.publicApi);
  if (!publicApi) throw new ManifestError(options.publicApi, 'arquivo não encontrado');
  for (const declaration of reader.exportedComponents(publicApi)) {
    const name = declaration.name?.text ?? '(sem nome)';
    const file = reader.relative(declaration.getSourceFile().fileName);
    if (!documented.has(file)) {
      problems.push(
        `${name} (${file}) não tem página no catálogo: crie o *.docs.ts ao lado e inclua em ${registry}`,
      );
    }
    for (const input of reader.inputsOf(declaration)) {
      if (!input.description) {
        problems.push(
          `${name}.${input.name} (${file}) sem JSDoc: descreva a input num comentário /** … */`,
        );
      }
    }
  }
  return problems;
}

/** Nomes listados no array `ALL_DOC_PAGES` do registro. */
export function registeredPages(registrySource: string): Set<string> {
  const list = /ALL_DOC_PAGES[^=]*=\s*\[([\s\S]*?)\]/.exec(registrySource)?.[1] ?? '';
  return new Set(list.match(/[A-Za-z_$][\w$]*/g) ?? []);
}
