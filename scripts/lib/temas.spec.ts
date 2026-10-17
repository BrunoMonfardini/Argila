import { describe, expect, it } from '@jest/globals';
import {
  arrayItems,
  cssImports,
  declaredTokens,
  objectKeys,
  requiredTokens,
  topLevelSelectors,
} from './temas.ts';

describe('cssImports', () => {
  it('lê os @import com aspas simples, duplas e url(), ignorando comentários', () => {
    const css = `
      /* @import './comentado.css'; */
      @import './a.css';
      @import "./b.css";
      @import url('./c.css');
    `;

    expect(cssImports(css)).toEqual(['./a.css', './b.css', './c.css']);
  });
});

describe('declaredTokens e requiredTokens', () => {
  const css = `
    :root { --a: 1px; --b: var(--a); --c: var(--x, red); }
    .x { color: var( --d ); }
  `;

  it('separa o que é declarado do que é lido sem reserva', () => {
    expect([...declaredTokens(css)]).toEqual(['--a', '--b', '--c']);
    expect([...requiredTokens(css)]).toEqual(['--a', '--d']);
  });
});

describe('topLevelSelectors', () => {
  it('devolve cada alternativa dos blocos de nível superior, sem @media', () => {
    const css = `
      :root[data-a='x'],
      :root[data-b='x'] { --a: 1; }
      @media (prefers-reduced-motion: reduce) { :root { --a: 0; } }
      .y { --b: 2; }
    `;

    expect(topLevelSelectors(css)).toEqual([":root[data-a='x']", ":root[data-b='x']", '.y']);
  });
});

describe('objectKeys e arrayItems', () => {
  const source = `
export const STYLES: Readonly<Record<string, Info>> = {
  argila: { schemes: ['light', 'dark'] },
  'windows-xp': { schemes: ['light'] },
};
export const PALETTES: readonly string[] = ['nativa', 'terrosa'];
`;

  it('lê as chaves de um objeto e os itens de um array exportados', () => {
    expect(objectKeys(source, 'STYLES')).toEqual(['argila', 'windows-xp']);
    expect(arrayItems(source, 'PALETTES')).toEqual(['nativa', 'terrosa']);
  });

  it('explica quando não encontra', () => {
    expect(() => objectKeys(source, 'NADA')).toThrow('objeto não encontrado: NADA');
    expect(() => arrayItems(source, 'NADA')).toThrow('array não encontrado: NADA');
  });
});
