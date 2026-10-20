import { describe, expect, it } from '@jest/globals';
import type { ArgDesignSystem } from './design-systems.ts';
import { comparisonHtml, comparisonShots, comparisonTargets, comparisonUrl } from './comparacao.ts';

function ds(id: string, extra: Partial<ArgDesignSystem> = {}): ArgDesignSystem {
  return {
    id,
    nome: id.toUpperCase(),
    linguagem: '',
    modos: ['light', 'dark'],
    transparencia: false,
    paletas: ['nativa'],
    componentes: { curados: [], fora: [] },
    exclusivos: [],
    regras: [],
    ...extra,
  };
}

describe('comparação com a referência', () => {
  const all = [
    ds('argila', { referencia: 'argila.jpg' }),
    ds('coda'),
    ds('punk', { referencia: 'punk.jpg', modos: ['dark'] }),
  ];

  it('só os DS com referência, ou só os pedidos', () => {
    expect(comparisonTargets(all).map((d) => d.id)).toEqual(['argila', 'punk']);
    expect(comparisonTargets(all, ['punk']).map((d) => d.id)).toEqual(['punk']);
    expect(comparisonTargets(all, ['coda'])).toEqual([]);
  });

  it('um DS que não existe é erro', () => {
    expect(() => comparisonTargets(all, ['arcade'])).toThrow('design system desconhecido: arcade');
  });

  it('uma captura por modo do DS, com o link que escolhe DS e modo', () => {
    expect(comparisonShots(all[2])).toEqual([
      { mode: 'dark', label: 'Escuro', file: 'punk-dark.png' },
    ]);
    expect(comparisonShots(all[0]).map((s) => s.label)).toEqual(['Claro', 'Escuro']);
    expect(comparisonUrl('http://localhost:4200/', all[0], 'dark')).toBe(
      'http://localhost:4200/design-systems/argila?ds=argila&modo=dark',
    );
  });

  it('a página põe a referência ao lado das capturas e escapa o texto', () => {
    const html = comparisonHtml({
      name: 'A & B',
      reference: '../docs/referencias/argila.jpg',
      shots: [{ label: 'Claro', file: 'argila-light.png' }],
    });

    expect(html).toContain('<title>A &amp; B: comparação com a referência</title>');
    expect(html).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
    expect(html.indexOf('../docs/referencias/argila.jpg')).toBeLessThan(
      html.indexOf('argila-light.png'),
    );
  });
});
