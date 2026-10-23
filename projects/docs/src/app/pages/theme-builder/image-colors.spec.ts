import { distance, extractColors, hexToOklab, oklabToHex, rgbToOklab } from './image-colors';

/** Pixels RGBA de faixas de cor: `[[r, g, b, quantos pixels], …]`. */
function stripes(...bands: [number, number, number, number, number?][]): Uint8ClampedArray {
  return new Uint8ClampedArray(
    bands.flatMap(([r, g, b, count, a = 255]) =>
      Array.from({ length: count }, () => [r, g, b, a]).flat(),
    ),
  );
}

const near = (hex: string, expected: string) =>
  distance(hexToOklab(hex), hexToOklab(expected)) < 0.02;

describe('extrator de cores', () => {
  it('converte sRGB para OKLab e volta', () => {
    expect(rgbToOklab(255, 255, 255)[0]).toBeCloseTo(1, 3);
    expect(rgbToOklab(0, 0, 0)[0]).toBeCloseTo(0, 3);
    for (const hex of ['#1f6fe0', '#e0a21f', '#0b1a33', '#ffffff']) {
      expect(oklabToHex(hexToOklab(hex))).toBe(hex);
    }
  });

  it('três faixas de cor dão as três cores, na ordem da área', () => {
    const { colors } = extractColors(
      stripes([200, 40, 40, 600], [40, 160, 60, 250], [40, 70, 200, 150]),
    );

    expect(colors).toHaveLength(3);
    expect(near(colors[0].hex, '#c82828')).toBe(true);
    expect(near(colors[1].hex, '#28a03c')).toBe(true);
    expect(near(colors[2].hex, '#2846c8')).toBe(true);
    expect(colors.map((c) => Math.round(c.share * 100))).toEqual([60, 25, 15]);
  });

  it('deixa de fora quase preto, quase branco, cinza e transparente', () => {
    const { colors } = extractColors(
      stripes(
        [5, 5, 5, 400],
        [250, 250, 250, 300],
        [128, 128, 128, 200],
        [200, 40, 40, 300, 0],
        [40, 70, 200, 100],
      ),
    );

    expect(colors).toHaveLength(1);
    expect(near(colors[0].hex, '#2846c8')).toBe(true);
  });

  it('sugere o modo pela luminosidade média e guarda os extremos', () => {
    const dark = extractColors(stripes([11, 26, 51, 800], [31, 111, 224, 200]));
    const light = extractColors(stripes([240, 236, 228, 800], [31, 111, 224, 200]));

    expect(dark.scheme).toBe('dark');
    expect(light.scheme).toBe('light');
    expect(dark.darkest).toBe('#0b1a33');
    expect(dark.lightest).toBe('#1f6fe0');
  });

  it('a mesma imagem dá sempre as mesmas cores', () => {
    const image = stripes([200, 40, 40, 300], [40, 160, 60, 300], [230, 170, 30, 300]);

    expect(extractColors(image)).toEqual(extractColors(image));
  });

  it('imagem sem pixels visíveis não tem cores', () => {
    expect(extractColors(stripes([200, 40, 40, 10, 0]))).toEqual({
      colors: [],
      scheme: 'light',
      darkest: '#000000',
      lightest: '#ffffff',
    });
  });
});
