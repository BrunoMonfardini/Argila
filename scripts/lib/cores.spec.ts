import { describe, expect, it } from '@jest/globals';
import { parseTokenBlocks } from './contraste.ts';
import { allowedColors, allowedColorsModule, colorsCss } from './cores.ts';

const COLORS = {
  escura: {
    nome: 'Escura',
    claro: '#1a1a1a',
    escuro: '#f0f0f0',
    sobreClaro: '#ffffff',
    sobreEscuro: '#000000',
  },
  clara: {
    nome: 'Clara',
    claro: '#dddddd',
    escuro: '#f5f5f5',
    sobreClaro: '#000000',
    sobreEscuro: '#000000',
  },
};

describe('colorsCss', () => {
  const css = colorsCss(COLORS, ['primary', 'accent']);

  it('uma regra por cor e papel, com o atributo repetido (força das paletas nativas)', () => {
    expect([...parseTokenBlocks(css).keys()]).toEqual([
      ":root[data-arg-primary][data-arg-primary='escura']",
      ":root[data-arg-accent][data-arg-accent='escura']",
      ":root[data-arg-primary][data-arg-primary='clara']",
      ":root[data-arg-accent][data-arg-accent='clara']",
    ]);
  });

  it('define a cor e o texto por cima; a primária leva também o preenchimento suave', () => {
    const blocks = parseTokenBlocks(css);
    const primary = blocks.get(":root[data-arg-primary][data-arg-primary='escura']")!;
    const accent = blocks.get(":root[data-arg-accent][data-arg-accent='escura']")!;

    expect(primary.get('--arg-color-primary')).toBe('light-dark(#1a1a1a, #f0f0f0)');
    expect(primary.get('--arg-color-on-primary')).toBe('light-dark(#ffffff, #000000)');
    expect(primary.get('--arg-color-primary-soft')).toContain('28%');
    expect(primary.get('--arg-color-on-primary-soft')).toBe('var(--arg-color-text)');
    expect([...accent.keys()]).toEqual(['--arg-color-accent', '--arg-color-on-accent']);
  });
});

describe('allowedColors', () => {
  const base = parseTokenBlocks(`:root {
    --arg-color-background: light-dark(#ffffff, #000000);
    --arg-color-surface: light-dark(#ffffff, #000000);
    --arg-color-surface-solid: light-dark(#ffffff, #000000);
    --arg-color-text: light-dark(#000000, #ffffff);
    --arg-surface-opacity: 1;
  }`);
  const pairs = [
    { foreground: '--arg-color-primary', background: '--arg-color-surface', minimum: 4.5 },
    { foreground: '--arg-color-on-primary', background: '--arg-color-primary', minimum: 4.5 },
  ];
  const css = colorsCss(COLORS, ['primary']);

  it('permite só as cores que passam em todos os pares, em cada modo do design system', () => {
    const matrix = allowedColors(
      [base],
      css,
      [{ id: 'ds', paletas: ['nativa'], modos: ['light', 'dark'] }],
      ['escura', 'clara'],
      ['primary'],
      () => pairs,
    );

    expect(matrix).toEqual({ ds: { nativa: { primary: ['escura'] } } });
  });

  it('usa os pares de cada paleta', () => {
    const matrix = allowedColors(
      [base],
      css,
      [{ id: 'ds', paletas: ['nativa', 'tolerante'], modos: ['light'] }],
      ['escura', 'clara'],
      ['primary'],
      (palette) => (palette === 'tolerante' ? [] : pairs),
    );

    expect(matrix['ds']['tolerante'].primary).toEqual(['escura', 'clara']);
    expect(matrix['ds']['nativa'].primary).toEqual(['escura']);
  });
});

describe('allowedColorsModule', () => {
  it('exporta a matriz tipada, avisando que é gerada', () => {
    const module = allowedColorsModule({
      ds: { nativa: { primary: ['escura'], secondary: [], accent: [] } },
    });

    expect(module).toContain('Não edite: rode `pnpm colors`.');
    expect(module).toContain("import type { ArgBrandColor, ArgBrandRole } from './colors';");
    expect(module).toContain('"primary": [\n        "escura"\n      ]');
  });
});
