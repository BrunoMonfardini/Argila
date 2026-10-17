/**
 * Regras de arquitetura que dependem do conteúdo dos arquivos (o
 * dependency-cruiser cuida dos imports). Cada função devolve a lista de
 * violações, vazia quando está tudo certo.
 */
import { topLevelSelectors } from './temas.ts';

export interface SourceFile {
  path: string;
  text: string;
}

/** O que as regras precisam de um manifesto. */
export interface DesignSystemRules {
  id: string;
  componentes: { curados: readonly string[]; fora: readonly string[] };
  exclusivos: readonly string[];
  prefixo?: string;
}

const withoutComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '');

const LITERAL_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i;
const DESIGN_SYSTEM_ATTRIBUTE = /data-arg-(?:style|brand|palette)/;

/**
 * CSS dos componentes do núcleo: só tokens semânticos. Nenhuma cor literal e
 * nenhum seletor de design system (isso é pele, e mora no design system).
 */
export function coreCssViolations(files: readonly SourceFile[]): string[] {
  return files.flatMap(({ path, text }) =>
    withoutComments(text)
      .split('\n')
      .flatMap((line, index) => {
        const problems: string[] = [];
        if (LITERAL_COLOR.test(line)) problems.push('cor literal');
        if (DESIGN_SYSTEM_ATTRIBUTE.test(line)) problems.push('seletor de design system');
        return problems.map((problem) => `${path}:${index + 1}: ${problem}: ${line.trim()}`);
      }),
  );
}

/**
 * Pele dos componentes curados (`componentes/<nome>.css`): um arquivo por
 * curado, nenhum a mais, e todo seletor preso ao próprio design system.
 */
export function skinViolations(ds: DesignSystemRules, skins: readonly SourceFile[]): string[] {
  const name = (path: string) =>
    path
      .replace(/\\/g, '/')
      .split('/')
      .pop()!
      .replace(/\.css$/, '');
  const names = skins.map((skin) => name(skin.path));
  const root = `:root[data-arg-style='${ds.id}']`;
  return [
    ...ds.componentes.curados
      .filter((component) => !names.includes(component))
      .map(
        (component) => `${ds.id}: "${component}" é curado mas não tem componentes/${component}.css`,
      ),
    ...names
      .filter((component) => !ds.componentes.curados.includes(component))
      .map(
        (component) =>
          `${ds.id}: componentes/${component}.css existe mas "${component}" não é curado`,
      ),
    ...ds.componentes.curados
      .filter((component) => ds.componentes.fora.includes(component))
      .map((component) => `${ds.id}: "${component}" está como curado e como fora`),
    ...skins.flatMap((skin) =>
      topLevelSelectors(skin.text)
        .filter((selector) => !selector.startsWith(root))
        .map(
          (selector) => `${ds.id}: ${name(skin.path)}.css tem seletor fora de ${root}: ${selector}`,
        ),
    ),
  ];
}

/**
 * Componentes exclusivos: nome com o prefixo do design system, uma pasta em
 * `exclusivos/` para cada um e o seletor `arg-<nome>` dentro dela.
 */
export function exclusiveViolations(
  ds: DesignSystemRules,
  folders: readonly string[],
  sources: readonly SourceFile[],
): string[] {
  const problems: string[] = [];
  if (ds.exclusivos.length && !ds.prefixo) {
    problems.push(`${ds.id}: tem exclusivos mas não define o prefixo`);
  }
  for (const exclusive of ds.exclusivos) {
    if (ds.prefixo && !exclusive.startsWith(`${ds.prefixo}-`)) {
      problems.push(`${ds.id}: o exclusivo "${exclusive}" não começa com "${ds.prefixo}-"`);
    }
    if (!folders.includes(exclusive)) {
      problems.push(
        `${ds.id}: o exclusivo "${exclusive}" não tem a pasta exclusivos/${exclusive}/`,
      );
    } else if (!sources.some((source) => source.text.includes(`'arg-${exclusive}'`))) {
      problems.push(
        `${ds.id}: nenhum componente de exclusivos/${exclusive}/ usa o seletor "arg-${exclusive}"`,
      );
    }
  }
  for (const folder of folders.filter((folder) => !ds.exclusivos.includes(folder))) {
    problems.push(`${ds.id}: exclusivos/${folder}/ não está no manifesto`);
  }
  return problems;
}
