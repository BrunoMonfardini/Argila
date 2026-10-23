import { argOklabToSrgb, argSrgbToOklab } from './oklab';

describe('conversão OKLab', () => {
  it('branco e preto ficam nas pontas da luminosidade, sem croma', () => {
    const [L, a, b] = argSrgbToOklab(1, 1, 1);
    expect(L).toBeCloseTo(1, 4);
    expect(Math.hypot(a, b)).toBeCloseTo(0, 4);
    expect(argSrgbToOklab(0, 0, 0)[0]).toBeCloseTo(0, 4);
  });

  it('ida e volta devolve a mesma cor', () => {
    for (const [r, g, b] of [
      [0.2, 0.4, 0.6],
      [0.9, 0.1, 0.3],
      [0.5, 0.5, 0.5],
    ]) {
      argOklabToSrgb(argSrgbToOklab(r, g, b)).forEach((c, i) =>
        expect(c).toBeCloseTo([r, g, b][i], 4),
      );
    }
  });

  it('prende ao que a tela mostra uma cor fora do sRGB', () => {
    for (const c of argOklabToSrgb([0.7, 0.4, 0.4])) {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(1);
    }
  });
});
