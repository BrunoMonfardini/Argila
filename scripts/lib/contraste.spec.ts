import { describe, expect, it } from 'vitest';
import {
  checkContrast,
  contrastFailures,
  contrastRatio,
  luminance,
  mergeTokens,
  mixOklab,
  parseTokenBlocks,
  resolveColor,
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

describe('mixOklab', () => {
  it('peso 1 devolve a primeira cor e peso 0 a segunda', () => {
    expect(hex(mixOklab(BLACK, WHITE, 1))).toBe('#000000');
    expect(hex(mixOklab(BLACK, WHITE, 0))).toBe('#ffffff');
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
});
