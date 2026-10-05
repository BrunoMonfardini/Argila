import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  IconError,
  generateModule,
  parseIcon,
  runIconGenerator,
  toConstName,
  validateName,
} from './icones.ts';

const ROOT =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

function svg(body: string, root = ROOT): string {
  return `<svg ${root}>${body}</svg>`;
}

function errorOf(name: string, source: string): string {
  try {
    parseIcon({ name, svg: source });
  } catch (error) {
    if (error instanceof IconError) return error.message;
    throw error;
  }
  throw new Error('esperava um IconError');
}

describe('validateName', () => {
  it('aceita kebab-case', () => {
    expect(() => validateName('arrow-left')).not.toThrow();
    expect(() => validateName('x')).not.toThrow();
  });

  it('recusa nome fora de kebab-case', () => {
    expect(() => validateName('ArrowLeft')).toThrow(/kebab-case/);
    expect(() => validateName('arrow_left')).toThrow(/kebab-case/);
  });

  it('recusa nome pelo uso e sugere a forma', () => {
    expect(() => validateName('delete')).toThrow('use "trash" em vez de "delete"');
  });
});

describe('parseIcon', () => {
  it('extrai só o desenho, com os atributos de geometria', () => {
    const icon = parseIcon({
      name: 'plus',
      svg: svg('<path d="M12 5v14 M5 12h14" />'),
    });

    expect(icon).toEqual({ name: 'plus', body: '<path d="M12 5v14 M5 12h14"/>' });
  });

  it('aceita circle, rect e line, e elementos com fechamento explícito', () => {
    const icon = parseIcon({
      name: 'shapes',
      svg: svg(
        '<circle cx="12" cy="12" r="4"></circle><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="4" y1="4" x2="20" y2="20"/>',
      ),
    });

    expect(icon.body).toBe(
      '<circle cx="12" cy="12" r="4"/><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="4" y1="4" x2="20" y2="20"/>',
    );
  });

  it('remove metadados do editor, comentários, id e class', () => {
    const source = `<?xml version="1.0"?>
      <!-- Criado no editor -->
      <svg ${ROOT} id="Camada_1" class="icone" xmlns:inkscape="x" inkscape:version="1.3" width="24px" height="24">
        <title>Mais</title>
        <metadata><rdf:RDF /></metadata>
        <sodipodi:namedview pagecolor="#fff" />
        <defs />
        <path id="p1" class="traco" data-name="linha" d="M12 5v14" />
      </svg>`;

    expect(parseIcon({ name: 'plus', svg: source }).body).toBe('<path d="M12 5v14"/>');
  });

  it('recusa grade diferente de 24', () => {
    const source = svg('<path d="M1 1"/>', ROOT.replace('0 0 24 24', '0 0 32 32'));

    expect(errorOf('plus', source)).toBe(
      'plus.svg: a grade precisa ser 24×24: viewBox="0 0 24 24"',
    );
  });

  it('recusa width ou height fora da grade', () => {
    expect(errorOf('plus', svg('<path d="M1 1"/>', `${ROOT} width="32"`))).toMatch(
      /width="32" foge da grade/,
    );
  });

  it('recusa preenchimento e cor fixa', () => {
    expect(errorOf('plus', svg('<path d="M12 5v14" fill="#000"/>'))).toMatch(
      /fill="#000" foge do padrão \(cor fixa ou preenchimento\): use fill="none"/,
    );
    expect(
      errorOf('plus', svg('<path d="M12 5v14"/>', ROOT.replace('currentColor', 'red'))),
    ).toMatch(/stroke="red" foge do padrão/);
  });

  it('recusa traço fora do padrão', () => {
    expect(errorOf('plus', svg('<path d="M12 5v14" stroke-width="1.5"/>'))).toMatch(
      /stroke-width="1.5" foge do padrão: use stroke-width="2"/,
    );
  });

  it('exige fill e stroke na raiz', () => {
    const root = 'viewBox="0 0 24 24" stroke="currentColor"';

    expect(errorOf('plus', svg('<path d="M12 5v14"/>', root))).toMatch(
      /o <svg> precisa de fill="none"/,
    );
  });

  it('recusa style, transform e atributos desconhecidos', () => {
    expect(errorOf('a', svg('<path d="M1 1" style="opacity:.5"/>'))).toMatch(
      /use atributos em vez de style/,
    );
    expect(errorOf('a', svg('<path d="M1 1" transform="rotate(45)"/>'))).toMatch(/sem transform/);
    expect(errorOf('a', svg('<path d="M1 1" opacity="0.5"/>'))).toMatch(
      /o atributo opacity não é permitido em <path>/,
    );
  });

  it('recusa grupos e elementos fora da lista', () => {
    expect(errorOf('a', svg('<g><path d="M1 1"/></g>'))).toMatch(/<g> não é permitido \(desagrupe/);
    expect(errorOf('a', svg('<polygon points="1 1"/>'))).toMatch(
      /use só <path>, <circle>, <rect> e <line>/,
    );
  });

  it('recusa elemento com conteúdo dentro', () => {
    expect(errorOf('a', svg('<path d="M1 1"><circle cx="12" cy="12" r="2"/></path>'))).toMatch(
      /<path> não pode ter elementos dentro/,
    );
  });

  it('recusa forma sem a geometria obrigatória ou com coordenada inválida', () => {
    expect(errorOf('a', svg('<circle cx="12" cy="12"/>'))).toMatch(/<circle> sem r/);
    expect(errorOf('a', svg('<line x1="a" y1="4" x2="20" y2="20"/>'))).toMatch(
      /coordenada que não é número/,
    );
  });

  it('recusa forma fora da área útil de 20×20', () => {
    expect(errorOf('a', svg('<circle cx="12" cy="12" r="11"/>'))).toMatch(
      /sai da área útil: mantenha o desenho entre 2 e 22/,
    );
    expect(errorOf('a', svg('<rect x="1" y="4" width="4" height="4"/>'))).toMatch(
      /sai da área útil/,
    );
  });

  it('recusa arquivo sem <svg> na raiz, sem desenho ou com texto solto', () => {
    expect(errorOf('a', '<path d="M1 1"/>')).toMatch(/um único <svg> na raiz/);
    expect(errorOf('a', svg(''))).toMatch(/nenhum desenho encontrado/);
    expect(errorOf('a', svg('texto <path d="M1 1"/>'))).toMatch(/conteúdo inesperado: "texto"/);
    expect(errorOf('a', `${svg('<path d="M1 1"/>')} sobra`)).toMatch(
      /conteúdo inesperado: "sobra"/,
    );
  });
});

describe('toConstName', () => {
  it('converte kebab-case no nome da constante', () => {
    expect(toConstName('arrow-left')).toBe('argIconArrowLeft');
    expect(toConstName('x')).toBe('argIconX');
    expect(toConstName('more-horizontal-2')).toBe('argIconMoreHorizontal2');
  });
});

describe('generateModule', () => {
  it('gera constantes em ordem alfabética, o tipo dos nomes e a lista completa', () => {
    const code = generateModule([
      { name: 'x', body: '<path d="M6 6l12 12"/>' },
      { name: 'arrow-left', body: '<path d="M5 12h14"/>' },
    ]);

    expect(code).toContain("export type ArgIconName = 'arrow-left' | 'x';");
    expect(code).toContain(
      `export const argIconArrowLeft: ArgIconDef = { name: 'arrow-left', svg: '<path d="M5 12h14"/>' };`,
    );
    expect(code.indexOf('argIconArrowLeft:')).toBeLessThan(code.indexOf('argIconX:'));
    expect(code).toContain('argIconsAll: readonly ArgIconDef[] = [argIconArrowLeft, argIconX];');
  });

  it('usa never quando não há ícones e escapa aspas simples', () => {
    expect(generateModule([])).toContain('export type ArgIconName = never;');
    expect(generateModule([{ name: 'a', body: "<path d='x'/>" }])).toContain(
      "svg: '<path d=\\'x\\'/>'",
    );
  });
});

describe('runIconGenerator', () => {
  let dir: string;

  function setup(files: Record<string, string>) {
    dir = mkdtempSync(join(tmpdir(), 'argila-icones-'));
    for (const [file, content] of Object.entries(files)) {
      writeFileSync(join(dir, file), content);
    }
    return { iconsDir: dir, outFile: join(dir, 'icons.generated.ts') };
  }

  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('grava o código gerado a partir dos SVGs da pasta', () => {
    const paths = setup({ 'plus.svg': svg('<path d="M12 5v14"/>'), 'leia-me.txt': 'ignorado' });

    const result = runIconGenerator({ ...paths, check: false });

    expect(result.ok).toBe(true);
    expect(result.messages).toEqual([`1 ícone(s) gerado(s) em ${paths.outFile}.`]);
    expect(readFileSync(paths.outFile, 'utf8')).toContain('argIconPlus');
  });

  it('lista todos os SVGs fora do padrão e não grava nada', () => {
    const paths = setup({
      'delete.svg': svg('<path d="M1 1"/>'),
      'plus.svg': svg('<path d="M1 1" fill="red"/>'),
    });

    const result = runIconGenerator({ ...paths, check: false });

    expect(result.ok).toBe(false);
    expect(result.messages).toHaveLength(3);
    expect(result.messages[2]).toBe('2 ícone(s) fora do padrão.');
  });

  it('no modo --check, acusa código desatualizado sem gravar', () => {
    const paths = setup({ 'plus.svg': svg('<path d="M12 5v14"/>') });

    const result = runIconGenerator({ ...paths, check: true });

    expect(result).toEqual({
      ok: false,
      messages: [`${paths.outFile} está desatualizado: rode pnpm icons.`],
    });
  });

  it('no modo --check, passa quando o código está atualizado', () => {
    const paths = setup({ 'plus.svg': svg('<path d="M12 5v14"/>') });
    runIconGenerator({ ...paths, check: false });

    const result = runIconGenerator({ ...paths, check: true });

    expect(result.ok).toBe(true);
  });

  it('propaga erros que não são de padrão de ícone', () => {
    expect(() =>
      runIconGenerator({
        iconsDir: join(tmpdir(), 'nao-existe-argila'),
        outFile: 'x',
        check: true,
      }),
    ).toThrow();
    dir = mkdtempSync(join(tmpdir(), 'argila-icones-'));
  });
});
