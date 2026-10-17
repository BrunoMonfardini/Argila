import { describe, expect, it } from '@jest/globals';
import {
  type DesignSystemRules,
  coreCssViolations,
  exclusiveViolations,
  skinViolations,
} from './arquitetura.ts';

const ds = (rules: Partial<DesignSystemRules> = {}): DesignSystemRules => ({
  id: 'nb',
  componentes: { curados: ['button'], fora: [] },
  exclusivos: [],
  ...rules,
});

describe('coreCssViolations', () => {
  it('aceita só tokens, inclusive cor citada em comentário', () => {
    const css = `/* antes era #fff */\n.arg-button { color: var(--arg-color-text); }`;

    expect(coreCssViolations([{ path: 'button.css', text: css }])).toEqual([]);
  });

  it('acusa cor literal e seletor de design system, com arquivo e linha', () => {
    const css = [
      '.a { color: #1d4f91; }',
      '.b { box-shadow: 0 0 0 1px rgb(0 0 0 / 0.2); }',
      ":root[data-arg-style='coda'] .c { color: var(--arg-color-text); }",
      '.d { background: oklch(70% 0.1 200); }',
    ].join('\n');

    expect(coreCssViolations([{ path: 'x.css', text: css }])).toEqual([
      'x.css:1: cor literal: .a { color: #1d4f91; }',
      'x.css:2: cor literal: .b { box-shadow: 0 0 0 1px rgb(0 0 0 / 0.2); }',
      "x.css:3: seletor de design system: :root[data-arg-style='coda'] .c { color: var(--arg-color-text); }",
      'x.css:4: cor literal: .d { background: oklch(70% 0.1 200); }',
    ]);
  });
});

describe('skinViolations', () => {
  const skin = (name: string, text = ":root[data-arg-style='nb'] .arg-button { --a: 1; }") => ({
    path: `tokens/design-systems/nb/componentes/${name}.css`,
    text,
  });

  it('aceita um arquivo por curado, com os seletores presos ao design system', () => {
    expect(skinViolations(ds(), [skin('button')])).toEqual([]);
  });

  it('acusa curado sem pele, pele sem curado e curado que também está fora', () => {
    const rules = ds({ componentes: { curados: ['button', 'card'], fora: ['card'] } });

    expect(skinViolations(rules, [skin('button'), skin('table')])).toEqual([
      'nb: "card" é curado mas não tem componentes/card.css',
      'nb: componentes/table.css existe mas "table" não é curado',
      'nb: "card" está como curado e como fora',
    ]);
  });

  it('acusa seletor que vale fora do design system', () => {
    const leak = skin(
      'button',
      ".arg-button { --a: 1; }\n:root[data-arg-style='coda'] .x { --b: 2; }",
    );

    expect(skinViolations(ds(), [leak])).toEqual([
      "nb: button.css tem seletor fora de :root[data-arg-style='nb']: .arg-button",
      "nb: button.css tem seletor fora de :root[data-arg-style='nb']: :root[data-arg-style='coda'] .x",
    ]);
  });
});

describe('exclusiveViolations', () => {
  const sticker = { path: 'exclusivos/nb-sticker/sticker.ts', text: "selector: 'arg-nb-sticker'," };

  it('aceita exclusivo com prefixo, pasta e seletor', () => {
    const rules = ds({ exclusivos: ['nb-sticker'], prefixo: 'nb' });

    expect(exclusiveViolations(rules, ['nb-sticker'], [sticker])).toEqual([]);
  });

  it('acusa falta de prefixo, prefixo errado, pasta faltando, seletor errado e pasta sobrando', () => {
    expect(
      exclusiveViolations(ds({ exclusivos: ['nb-sticker'] }), ['nb-sticker'], [sticker]),
    ).toEqual(['nb: tem exclusivos mas não define o prefixo']);
    expect(
      exclusiveViolations(
        ds({ exclusivos: ['sticker', 'nb-rules'], prefixo: 'nb' }),
        ['nb-rules', 'nb-velho'],
        [],
      ),
    ).toEqual([
      'nb: o exclusivo "sticker" não começa com "nb-"',
      'nb: o exclusivo "sticker" não tem a pasta exclusivos/sticker/',
      'nb: nenhum componente de exclusivos/nb-rules/ usa o seletor "arg-nb-rules"',
      'nb: exclusivos/nb-velho/ não está no manifesto',
    ]);
  });
});
