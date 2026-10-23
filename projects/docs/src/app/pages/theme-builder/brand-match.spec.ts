import { ARG_ALLOWED_COLORS, ARG_BRAND_COLORS, type ArgBrandColor } from '@brunomonfardini/ui';
import { matchBrandColors } from './brand-match';
import { type ImageColor, hexToOklab } from './image-colors';

const color = (hex: string, share = 0.3): ImageColor => ({ hex, oklab: hexToOklab(hex), share });
/** As cores extraídas da imagem azul de exemplo (CI-01), da mais marcante para a menos. */
const BLUE_IMAGE = [color('#0953b3'), color('#066ae8'), color('#001937')];
const TRANSPARENTE = ARG_ALLOWED_COLORS['transparente']['nativa'];

describe('cores da imagem para a lista fixa', () => {
  it('a imagem azul de exemplo dá anil, ardósia e grafite: o fundo marinho tem pouco croma', () => {
    const matches = matchBrandColors(BLUE_IMAGE, 'dark', TRANSPARENTE);

    expect(matches.map((m) => m.role)).toEqual(['primary', 'secondary', 'accent']);
    expect(new Set(matches.map((m) => m.color)).size).toBe(3);
    expect(matches.map((m) => m.color)).toEqual(['anil', 'ardosia', 'grafite']);
    expect(matches[0].source).toBe('#0953b3');
  });

  it('o matiz decide mais que o croma: azul-marinho fica longe da lavanda', () => {
    const allowed = { primary: ['lavanda', 'ardosia'], secondary: [], accent: [] } as Record<
      'primary' | 'secondary' | 'accent',
      ArgBrandColor[]
    >;

    expect(matchBrandColors([color('#001937')], 'dark', allowed)[0].color).toBe('ardosia');
  });

  it('usa o valor do modo: a mesma cor pode dar nomes diferentes no claro e no escuro', () => {
    const light = matchBrandColors([color('#9a4f24')], 'light', TRANSPARENTE);
    const dark = matchBrandColors([color('#f0b48a')], 'dark', TRANSPARENTE);

    expect(light[0]).toMatchObject({ color: 'cobre', distance: 0 });
    expect(dark[0]).toMatchObject({ color: 'cobre', distance: 0 });
  });

  it('só escolhe cores que o papel aceita', () => {
    const allowed = { primary: ['oliva'], secondary: ['musgo', 'oliva'], accent: [] } as Record<
      'primary' | 'secondary' | 'accent',
      ArgBrandColor[]
    >;

    const matches = matchBrandColors(BLUE_IMAGE, 'light', allowed);

    expect(matches).toEqual([
      expect.objectContaining({ role: 'primary', color: 'oliva' }),
      expect.objectContaining({ role: 'secondary', color: 'musgo' }),
    ]);
  });

  it('com uma cor só na imagem, os outros papéis usam a mesma, com nomes diferentes', () => {
    const matches = matchBrandColors([color('#3346a8')], 'light', TRANSPARENTE);

    expect(matches[0].color).toBe('anil');
    expect(matches.every((m) => m.source === '#3346a8')).toBe(true);
    expect(new Set(matches.map((m) => m.color)).size).toBe(3);
  });

  it('em todo DS × paleta, nenhuma escolha fica fora do que o papel aceita', () => {
    for (const palettes of Object.values(ARG_ALLOWED_COLORS)) {
      for (const allowed of Object.values(palettes)) {
        for (const scheme of ['light', 'dark'] as const) {
          for (const m of matchBrandColors(BLUE_IMAGE, scheme, allowed)) {
            expect(allowed[m.role]).toContain(m.color);
            expect(ARG_BRAND_COLORS[m.color]).toBeDefined();
          }
        }
      }
    }
  });

  it('imagem sem cores não escolhe nada', () => {
    expect(matchBrandColors([], 'dark', TRANSPARENTE)).toEqual([]);
  });
});
