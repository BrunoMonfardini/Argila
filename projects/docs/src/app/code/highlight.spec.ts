import { CodeToken, highlight } from './highlight';

function kinds(tokens: CodeToken[]): string[] {
  return tokens.filter((t) => t.kind !== 'plain').map((t) => `${t.kind}:${t.text}`);
}

describe('highlight', () => {
  it('reconstrói o código original, sem perder nenhum caractere', () => {
    const code = "import { A } from './a';\n// nota\nconst n = 42;";

    expect(
      highlight(code, 'ts')
        .map((t) => t.text)
        .join(''),
    ).toBe(code);
  });

  it('marca palavras-chave, strings, números, comentários e decorators em TypeScript', () => {
    const tokens = highlight("@Component\nexport class X { n = 4.5; s = 'oi'; /* c */ }", 'ts');

    expect(kinds(tokens)).toEqual([
      'decorator:@Component',
      'keyword:export',
      'keyword:class',
      'number:4.5',
      "string:'oi'",
      'comment:/* c */',
    ]);
  });

  it('não confunde palavra-chave dentro de um identificador', () => {
    expect(kinds(highlight('constant classy h1', 'ts'))).toEqual([]);
  });

  it('trata o conteúdo entre crases como HTML', () => {
    const tokens = highlight('template: `<button arg-button variant="primary">Ok</button>`', 'ts');

    expect(kinds(tokens)).toEqual([
      'string:`',
      'tag:<button',
      'attr:variant',
      'string:"primary"',
      'tag:>',
      'tag:</button',
      'tag:>',
      'string:`',
    ]);
  });

  it('marca comentários de HTML', () => {
    expect(kinds(highlight('<!-- nota --><br/>', 'html'))).toEqual([
      'comment:<!-- nota -->',
      'tag:<br',
      'tag:/>',
    ]);
  });

  it('marca propriedades, números e strings em CSS', () => {
    expect(kinds(highlight(":host { --arg-x: 2px; content: 'a'; /* c */ }", 'css'))).toEqual([
      'property:--arg-x',
      'number:2px',
      'property:content',
      "string:'a'",
      'comment:/* c */',
    ]);
  });
});
