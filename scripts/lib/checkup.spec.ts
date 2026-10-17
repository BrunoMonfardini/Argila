// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import {
  auditPage,
  combinationName,
  combinations,
  pageFile,
  reportHtml,
  styleSchemes,
} from './checkup.ts';

describe('styleSchemes', () => {
  it('lê os estilos e os modos de ARG_STYLES', () => {
    const source = `
export const ARG_STYLES: Readonly<Record<ArgStyle, ArgStyleInfo>> = {
  argila: { schemes: ['light', 'dark'] },
  'windows-xp': { schemes: ['dark'] },
};`;

    expect(styleSchemes(source)).toEqual({ argila: ['light', 'dark'], 'windows-xp': ['dark'] });
    expect(() => styleSchemes('')).toThrow('ARG_STYLES não encontrado');
  });
});

describe('combinations e combinationName', () => {
  it('cruza estilo, paleta e só os modos que o estilo suporta', () => {
    const combos = combinations({ a: ['light', 'dark'], b: ['dark'] }, ['nativa', 'terrosa']);

    expect(combos.map(combinationName)).toEqual([
      'a-nativa-claro',
      'a-nativa-escuro',
      'a-terrosa-claro',
      'a-terrosa-escuro',
      'b-nativa-escuro',
      'b-terrosa-escuro',
    ]);
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

  it('ignora rótulos de controles desabilitados e texto só para leitor de tela', () => {
    const gray = 'color: rgb(220, 220, 220)';
    document.body.innerHTML = `
      <div style="background-color: rgb(255, 255, 255)">
        <label style="${gray}"><input type="checkbox" disabled />Em breve</label>
        <label style="${gray}"><input type="radio" disabled /><span>08:00</span></label>
        <span style="${gray}; position: absolute; width: 1px; height: 1px; overflow: hidden">, ocupado</span>
        <label style="${gray}"><input type="checkbox" />Ativo</label>
      </div>`;

    const texts = auditPage().lowContrast.map((entry) => entry.text);

    expect(texts).toEqual(['Ativo']);
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
    const combos = combinations({ argila: ['light'] }, ['nativa']);
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
