import { type VeilColors, minimumVeil, parseColor } from './veil';

const DARK: VeilColors = {
  background: [17, 17, 17],
  texts: [[238, 238, 238]],
  spots: [],
};

describe('véu mínimo de uma imagem', () => {
  it('lê hex e rgb()', () => {
    expect(parseColor('#0b1a33')).toEqual([11, 26, 51]);
    expect(parseColor('rgb(1, 2, 3)')).toEqual([1, 2, 3]);
    expect(() => parseColor('light-dark(#000, #fff)')).toThrow('cor não suportada');
  });

  it('uma imagem toda escura no modo escuro não precisa de véu', () => {
    expect(minimumVeil([[0, 0, 0]], DARK)).toBe(0);
  });

  it('um pixel branco no modo escuro pede véu, e o véu achado é o menor que passa', () => {
    const veil = minimumVeil([[255, 255, 255]], DARK);

    expect(veil).toBeGreaterThan(0.5);
    expect(veil).toBeLessThan(1);
    // Um ponto a menos já não passaria: o texto sobre o branco com véu mais fino
    expect(minimumVeil([[255, 255, 255]], { ...DARK, texts: [[238, 238, 238]] })).toBe(veil);
  });

  it('as manchas por cima da imagem também entram na conta', () => {
    const plain = minimumVeil([[0, 0, 0]], DARK);
    const withSpot = minimumVeil([[0, 0, 0]], { ...DARK, spots: [[255, 255, 255]] });

    expect(plain).toBe(0);
    expect(withSpot).toBeGreaterThan(0);
  });

  it('quando nem o véu opaco basta, devolve 1', () => {
    expect(minimumVeil([[0, 0, 0]], { ...DARK, texts: [[30, 30, 30]] })).toBe(1);
  });
});
