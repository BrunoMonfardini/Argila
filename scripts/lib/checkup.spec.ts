/**
 * @jest-environment jsdom
 */
import { afterEach, describe, expect, it } from '@jest/globals';
import { auditPage, combinationName, combinations, pageFile, reportHtml } from './checkup.ts';

describe('combinations e combinationName', () => {
  const designSystems = [
    { id: 'a', modos: ['light', 'dark'] as const, paletas: ['nativa', 'terrosa'] },
    { id: 'b', modos: ['dark'] as const, paletas: ['nativa', 'oceano'] },
  ];

  it('cruza design system, só as paletas que ele aceita e só os modos que ele suporta', () => {
    const combos = combinations(designSystems);

    expect(combos.map(combinationName)).toEqual([
      'a-nativa-claro',
      'a-nativa-escuro',
      'a-terrosa-claro',
      'a-terrosa-escuro',
      'b-nativa-escuro',
      'b-oceano-escuro',
    ]);
  });

  it('filtra as paletas, sem incluir as que o design system não aceita', () => {
    const combos = combinations(designSystems, ['oceano']);

    expect(combos.map(combinationName)).toEqual(['b-oceano-escuro']);
  });
});

describe('pageFile', () => {
  it('vira nome de arquivo, com a raiz como "inicio"', () => {
    expect(pageFile('/componentes/button')).toBe('componentes-button');
    expect(pageFile('/')).toBe('inicio');
  });
});

describe('auditPage', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('acusa texto com pouco contraste sobre o fundo efetivo, uma vez por combinação', () => {
    document.body.innerHTML = `
      <div style="background-color: rgb(255, 255, 255)">
        <p style="color: rgb(170, 170, 170)">Cinza claro demais</p>
        <p style="color: rgb(170, 170, 170)">Repetido</p>
        <p style="color: rgb(0, 0, 0)">Preto</p>
        <button disabled style="color: rgb(220, 220, 220)">Desabilitado</button>
      </div>`;

    const { lowContrast } = auditPage();

    expect(lowContrast).toEqual([
      {
        element: 'p',
        text: 'Cinza claro demais',
        ratio: expect.any(Number),
        minimum: 4.5,
        color: '#aaaaaa',
        background: '#ffffff',
      },
    ]);
    expect(lowContrast[0].ratio).toBeLessThan(4.5);
  });

  it('compõe fundos translúcidos e aceita 3:1 para texto grande', () => {
    document.body.innerHTML = `
      <div style="background-color: rgb(0, 0, 0)">
        <div style="background-color: rgba(255, 255, 255, 0.5)">
          <h1 style="color: rgb(255, 255, 255); font-size: 32px">Grande</h1>
        </div>
      </div>`;

    expect(auditPage().lowContrast).toEqual([]);
  });

  it('ignora fundos com imagem, que não dá para medir', () => {
    document.body.innerHTML = `
      <div style="background-image: linear-gradient(red, blue)">
        <p style="color: rgb(250, 250, 250)">Sobre gradiente</p>
      </div>`;

    expect(auditPage().lowContrast).toEqual([]);
  });
});

describe('reportHtml', () => {
  it('lista os problemas e monta a grade página × combinação, escapando o texto', () => {
    const combos = combinations([{ id: 'argila', modos: ['light'], paletas: ['nativa'] }]);
    const html = reportHtml(['/componentes/button'], combos, [
      {
        page: '/componentes/button',
        combination: 'argila-nativa-claro',
        kind: 'erro',
        detail: '<b>falhou</b>',
      },
    ]);

    expect(html).toContain('1 página(s) × 1 combinação(ões); 1 problema(s).');
    expect(html).toContain('&lt;b&gt;falhou&lt;/b&gt;');
    expect(html).toContain('src="argila-nativa-claro/componentes-button.png"');
  });

  it('diz quando não há problema', () => {
    expect(reportHtml([], [], [])).toContain('<p>Nenhum.</p>');
  });
});
