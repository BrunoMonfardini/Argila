import { describe, expect, it } from '@jest/globals';
import {
  checkContrast,
  checkVeilContrast,
  composite,
  contrastFailures,
  contrastRatio,
  evaluateNumber,
  luminance,
  matchesRoot,
  mergeTokens,
  minimumVeil,
  mixOklab,
  parseTokenBlocks,
  resolveColor,
  tokensForRoot,
} from './contraste.ts';

const WHITE = { r: 1, g: 1, b: 1 };
const BLACK = { r: 0, g: 0, b: 0 };

function hex({ r, g, b }: { r: number; g: number; b: number }): string {
  return (
    '#' +
    [r, g, b]
      .map((c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

describe('parseTokenBlocks', () => {
  it('lê as declarações por seletor e ignora @media e comentários', () => {
    const blocks = parseTokenBlocks(`
      /* --arg-falso: 1; */
      :root { --arg-a: #fff; --arg-b: light-dark(
        #000,
        #fff
      ); }
      [data-arg-theme='dark'] { color-scheme: dark; }
      @media (prefers-reduced-motion: reduce) { :root { --arg-a: #000; } }
      :root { --arg-c: var(--arg-a); }
    `);

    expect(Object.fromEntries(blocks.get(':root')!)).toEqual({
      '--arg-a': '#fff',
      '--arg-b': 'light-dark( #000, #fff )',
      '--arg-c': 'var(--arg-a)',
    });
    expect(blocks.get("[data-arg-theme='dark']")!.size).toBe(0);
  });
});

describe('mergeTokens', () => {
  it('aplica os seletores em ordem: o último sobrescreve', () => {
    const base = parseTokenBlocks(':root { --a: #111; --b: #222; }');
    const theme = parseTokenBlocks('.marca { --a: #333; }');

    const tokens = mergeTokens([base, theme], [':root', '.marca']);

    expect(Object.fromEntries(tokens)).toEqual({ '--a': '#333', '--b': '#222' });
  });
});

describe('matchesRoot', () => {
  const coda = { 'data-arg-style': 'coda' };

  it('casa :root, atributo presente, valor e negação', () => {
    expect(matchesRoot(':root', {})).toBe(true);
    expect(matchesRoot(":root[data-arg-style='coda']", coda)).toBe(true);
    expect(matchesRoot(":root[data-arg-style='xp']", coda)).toBe(false);
    expect(matchesRoot(":root[data-arg-style='coda']:not([data-arg-palette])", coda)).toBe(true);
    expect(
      matchesRoot(":root[data-arg-style='coda']:not([data-arg-palette])", {
        ...coda,
        'data-arg-palette': 'mono',
      }),
    ).toBe(false);
    expect(matchesRoot("[data-arg-theme='dark']", coda)).toBe(false);
  });

  it('aceita alternativas separadas por vírgula e recusa outros seletores', () => {
    const selector = ":root[data-arg-style='coda'],\n:root[data-arg-brand='coda']";
    expect(matchesRoot(selector, { 'data-arg-brand': 'coda' })).toBe(true);
    expect(matchesRoot('html', {})).toBe(false);
    expect(matchesRoot(':root.marca', {})).toBe(false);
  });
});

describe('tokensForRoot', () => {
  it('junta os blocos que casam, na ordem dos arquivos', () => {
    const base = parseTokenBlocks(':root { --a: #111; --b: #222; }');
    const style = parseTokenBlocks(":root[data-arg-style='x'] { --a: #333; }");
    const other = parseTokenBlocks(":root[data-arg-style='y'] { --b: #444; }");

    const tokens = tokensForRoot([base, style, other], { 'data-arg-style': 'x' });

    expect(Object.fromEntries(tokens)).toEqual({ '--a': '#333', '--b': '#222' });
  });
});

describe('resolveColor', () => {
  const tokens = new Map([
    ['--base', '#a24c24'],
    ['--tema', 'light-dark(var(--base), #d27a4c)'],
    ['--hover', 'color-mix(in oklab, var(--base), #000 12%)'],
    ['--a', 'var(--b)'],
    ['--b', 'var(--a)'],
  ]);

  it('lê hex curto e longo e rgb()', () => {
    expect(resolveColor('#fff', tokens, 'light')).toEqual(WHITE);
    expect(hex(resolveColor('#a24c24', tokens, 'light'))).toBe('#a24c24');
    expect(hex(resolveColor('rgb(20 18 17 / 0.56)', tokens, 'light'))).toBe('#141211');
    expect(resolveColor('rgb(20 18 17 / 0.56)', tokens, 'light').a).toBe(0.56);
    expect(resolveColor('rgb(20 18 17 / 40%)', tokens, 'light').a).toBe(0.4);
    expect(resolveColor('transparent', tokens, 'light').a).toBe(0);
  });

  it('mistura com transparent e peso em calc()', () => {
    const vidro = new Map([['--opacidade', '0.6']]);
    const cor = resolveColor(
      'color-mix(in oklab, #fff calc(clamp(0.4, var(--opacidade), 1) * 100%), transparent)',
      vidro,
      'light',
    );

    expect(hex(cor)).toBe('#ffffff');
    expect(cor.a).toBeCloseTo(0.6, 5);

    const porToken = new Map([['--peso', 'calc(var(--opacidade) * 100%)'], ...vidro]);
    const viaToken = resolveColor(
      'color-mix(in oklab, #fff var(--peso), transparent)',
      porToken,
      'light',
    );
    expect(viaToken.a).toBeCloseTo(0.6, 5);
  });

  it('segue var() e usa o valor reserva quando o token não existe', () => {
    expect(hex(resolveColor('var(--base)', tokens, 'light'))).toBe('#a24c24');
    expect(resolveColor('var(--nao-existe, #000)', tokens, 'light')).toEqual(BLACK);
  });

  it('escolhe o lado do light-dark() pelo tema', () => {
    expect(hex(resolveColor('var(--tema)', tokens, 'light'))).toBe('#a24c24');
    expect(hex(resolveColor('var(--tema)', tokens, 'dark'))).toBe('#d27a4c');
  });

  it('mistura em oklab com o peso de qualquer um dos lados', () => {
    const hover = resolveColor('var(--hover)', tokens, 'light');
    expect(luminance(hover)).toBeLessThan(luminance(resolveColor('#a24c24', tokens, 'light')));

    const meio = resolveColor('color-mix(in oklab, #000, #fff)', tokens, 'light');
    const peso = resolveColor('color-mix(in oklab, #000 50%, #fff)', tokens, 'light');
    expect(meio).toEqual(peso);
  });

  it('explica o que não consegue resolver', () => {
    expect(() => resolveColor('var(--nada)', tokens, 'light')).toThrow(
      'token não definido: --nada',
    );
    expect(() => resolveColor('var(--a)', tokens, 'light')).toThrow('referência circular');
    expect(() => resolveColor('red', tokens, 'light')).toThrow('cor não suportada: "red"');
    expect(() => resolveColor('hsl(0 0% 0%)', tokens, 'light')).toThrow('hsl()');
    expect(() => resolveColor('color-mix(in srgb, #000, #fff)', tokens, 'light')).toThrow(
      'só é suportado em oklab',
    );
  });
});

describe('evaluateNumber', () => {
  const tokens = new Map([['--x', '0.2']]);

  it('resolve var(), clamp(), multiplicação, divisão e porcentagem', () => {
    expect(evaluateNumber('calc(var(--x) * 100%)', tokens)).toBeCloseTo(0.2, 5);
    expect(evaluateNumber('clamp(0.4, var(--x), 1)', tokens)).toBe(0.4);
    expect(evaluateNumber('calc(clamp(0.4, 0.9, 1) / 2)', tokens)).toBeCloseTo(0.45, 5);
    expect(evaluateNumber('12%', tokens)).toBeCloseTo(0.12, 5);
    expect(evaluateNumber('calc(calc(var(--x) * 2) * 100%)', tokens)).toBeCloseTo(0.4, 5);
  });

  it('explica o que não consegue calcular', () => {
    expect(() => evaluateNumber('calc(var(--nada) * 2)', tokens)).toThrow('--nada');
    expect(() => evaluateNumber('calc(1 + 2)', tokens)).toThrow('expressão não suportada');
  });
});

describe('mixOklab', () => {
  it('peso 1 devolve a primeira cor e peso 0 a segunda', () => {
    expect(hex(mixOklab(BLACK, WHITE, 1))).toBe('#000000');
    expect(hex(mixOklab(BLACK, WHITE, 0))).toBe('#ffffff');
  });

  it('com transparente, mantém a cor e reduz a opacidade', () => {
    const meio = mixOklab(WHITE, { ...BLACK, a: 0 }, 0.5);

    expect(hex(meio)).toBe('#ffffff');
    expect(meio.a).toBeCloseTo(0.5, 5);
  });
});

describe('composite', () => {
  it('pinta a cor translúcida sobre a base; opaca não muda', () => {
    expect(hex(composite({ ...WHITE, a: 0.5 }, BLACK))).toBe('#808080');
    expect(composite(WHITE, BLACK)).toEqual(WHITE);
  });
});

describe('contrastRatio', () => {
  it('bate com os valores de referência do WCAG', () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, WHITE)).toBe(1);
    // #767676 sobre branco é o cinza mais claro que atinge 4.5:1
    expect(contrastRatio(resolveColor('#767676', new Map(), 'light'), WHITE)).toBeCloseTo(4.54, 2);
  });
});

describe('checkContrast e contrastFailures', () => {
  const tokens = new Map([
    ['--texto', 'light-dark(#000, #777)'],
    ['--fundo', 'light-dark(#fff, #888)'],
  ]);
  const pairs = [{ foreground: '--texto', background: '--fundo', minimum: 4.5 }];

  it('calcula por tema e só lista o que fica abaixo do mínimo', () => {
    expect(checkContrast(tokens, pairs, 'light')[0].ratio).toBe(21);
    expect(contrastFailures(checkContrast(tokens, pairs, 'light'))).toEqual([]);

    const [failure] = contrastFailures(checkContrast(tokens, pairs, 'dark'));
    expect(failure).toMatch(/^dark: --texto sobre --fundo = 1\.\d+:1 \(mínimo 4\.5:1\)$/);
  });

  it('compõe o fundo translúcido sobre o fundo da página', () => {
    const vidro = new Map([
      ['--texto', '#777'],
      ['--fundo', 'rgb(255 255 255 / 0.1)'],
      ['--pagina', '#000'],
    ]);

    const [result] = checkContrast(vidro, pairs, 'light', '--pagina');

    // Branco a 10% sobre preto fica quase preto: o cinza contrasta pouco
    expect(result.ratio).toBeLessThan(4.5);
  });
});

describe('fundo de imagem', () => {
  const veilTokens = (veil: string) =>
    new Map([
      ['--arg-color-background', '#ffffff'],
      ['--arg-color-text', '#222222'],
      ['--arg-background-veil', veil],
    ]);

  it('confere cada texto sobre o véu em preto e em branco', () => {
    const results = checkVeilContrast(veilTokens('#ffffff'), ['--arg-color-text'], 4.5, 'light');

    expect(results.map((r) => r.background)).toEqual([
      '--arg-background-veil sobre #000',
      '--arg-background-veil sobre #fff',
    ]);
    // Véu opaco: o pixel por baixo não importa
    expect(results[0].ratio).toBe(results[1].ratio);
  });

  it('um véu fino demais falha sobre o pixel preto', () => {
    const thin = 'color-mix(in oklab, var(--arg-color-background) 20%, transparent)';
    const failures = contrastFailures(
      checkVeilContrast(veilTokens(thin), ['--arg-color-text'], 4.5, 'light'),
    );

    expect(failures[0]).toMatch(
      /^light: --arg-color-text sobre --arg-background-veil sobre #000 = /,
    );
  });

  it('acha a menor opacidade do véu que passa', () => {
    const tokens = veilTokens('transparent');
    const percent = minimumVeil(tokens, ['--arg-color-text'], 4.5, 'light')!;
    const at = (p: number) =>
      new Map(tokens).set(
        '--arg-background-veil',
        `color-mix(in oklab, var(--arg-color-background) ${p}%, transparent)`,
      );

    expect(percent).toBeGreaterThan(0);
    expect(
      contrastFailures(checkVeilContrast(at(percent), ['--arg-color-text'], 4.5, 'light')),
    ).toEqual([]);
    expect(
      contrastFailures(checkVeilContrast(at(percent - 1), ['--arg-color-text'], 4.5, 'light')),
    ).not.toEqual([]);
    expect(minimumVeil(tokens, ['--arg-color-text'], 30, 'light')).toBeUndefined();
  });
});
