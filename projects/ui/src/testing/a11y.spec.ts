import { a11yViolations, accessibleName } from './a11y';

describe('a11yViolations', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
  });

  afterEach(() => root.remove());

  function check(html: string) {
    root.innerHTML = html;
    return a11yViolations(root);
  }

  function rules(html: string) {
    return check(html).map((violation) => violation.rule);
  }

  it('aceita uma página bem marcada', () => {
    const html = `
      <h2 id="titulo">Pedidos</h2>
      <button type="button">Salvar</button>
      <a href="/ajuda">Ajuda</a>
      <label>Nome <input type="text" /></label>
      <label for="email">E-mail</label><input id="email" type="email" />
      <div role="progressbar" aria-label="Carregando"></div>
      <section aria-labelledby="titulo"></section>
      <img src="a.png" alt="" />
      <svg aria-hidden="true"><path d="M0 0" /></svg>
      <span role="img" aria-label="Atenção"><svg aria-hidden="true"></svg></span>
      <div tabindex="0">rolável</div>
      <div aria-hidden="true"><span>decorativo</span></div>
      <a>âncora sem href não é link</a>
      <input type="hidden" />
    `;

    expect(check(html)).toEqual([]);
  });

  it('exige nome em controles interativos', () => {
    expect(rules('<button type="button"></button>')).toEqual(['nome-acessivel']);
    expect(rules('<a href="/x"><span aria-hidden="true">›</span></a>')).toEqual(['nome-acessivel']);
    expect(rules('<input type="text" />')).toEqual(['nome-acessivel']);
    expect(rules('<select></select>')).toEqual(['nome-acessivel']);
    expect(rules('<div role="progressbar"></div>')).toEqual(['nome-acessivel']);
  });

  it('explica a violação com a regra, o elemento e o que fazer', () => {
    const [violation] = check('<button type="button"></button>');

    expect(violation).toEqual({
      rule: 'nome-acessivel',
      element: '<button type="button"></button>',
      message: 'button sem nome acessível: use texto, aria-label ou aria-labelledby',
    });
  });

  it('ignora controles ocultos de tecnologias assistivas', () => {
    expect(check('<div aria-hidden="true"><div role="img"></div></div>')).toEqual([]);
    expect(check('<div hidden><div role="progressbar"></div></div>')).toEqual([]);
  });

  it('recusa atributo aria que não existe e valor inválido', () => {
    expect(rules('<div aria-labeledby="x"></div>')).toEqual(['aria-desconhecido']);
    expect(rules('<button type="button" aria-pressed="sim">A</button>')).toEqual(['aria-valor']);
    expect(rules('<div aria-live="rude"></div>')).toEqual(['aria-valor']);
    expect(check('<div aria-current="page" aria-busy="true" aria-checked="mixed"></div>')).toEqual(
      [],
    );
  });

  it('exige que os ids referenciados existam', () => {
    expect(rules('<button type="button" aria-describedby="nao-existe">A</button>')).toEqual([
      'aria-id',
    ]);
    expect(rules('<p id="a">x</p><button type="button" aria-controls="a b">A</button>')).toEqual([
      'aria-id',
    ]);
  });

  it('recusa tabindex positivo', () => {
    expect(rules('<div tabindex="2"></div>')).toEqual(['tabindex-positivo']);
    expect(check('<div tabindex="-1"></div>')).toEqual([]);
  });

  it('exige alt em imagens e nome ou aria-hidden em svg', () => {
    expect(rules('<img src="a.png" />')).toEqual(['imagem-sem-alt']);
    expect(rules('<svg><path d="M0 0" /></svg>')).toEqual(['svg-sem-nome']);
    expect(rules('<svg role="img"></svg>')).toEqual(['nome-acessivel', 'svg-sem-nome']);
    expect(check('<svg role="img" aria-label="Logo"><g><path d="M0 0" /></g></svg>')).toEqual([]);
  });

  it('recusa elemento focável dentro de aria-hidden', () => {
    expect(rules('<div aria-hidden="true"><a href="/x">Ir</a></div>')).toEqual(['foco-escondido']);
    expect(rules('<button type="button" aria-hidden="true">X</button>')).toEqual([
      'foco-escondido',
    ]);
  });
});

describe('accessibleName', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
  });

  afterEach(() => root.remove());

  function nameOf(html: string, selector: string): string {
    root.innerHTML = html;
    return accessibleName(root.querySelector(selector)!);
  }

  it('segue a precedência: aria-labelledby, aria-label, label, conteúdo, title', () => {
    expect(
      nameOf('<b id="t">Título</b><button aria-label="X" aria-labelledby="t">Y</button>', 'button'),
    ).toBe('Título');
    expect(nameOf('<button aria-label="Fechar">×</button>', 'button')).toBe('Fechar');
    expect(nameOf('<label>Nome <input /></label>', 'input')).toBe('Nome');
    expect(nameOf('<button>  Salvar   agora </button>', 'button')).toBe('Salvar agora');
    expect(nameOf('<div role="img" title="Logo"></div>', 'div')).toBe('Logo');
  });

  it('lê alt e aria-label dos filhos e pula o que está oculto', () => {
    expect(nameOf('<a href="#"><img src="a" alt="Início" /></a>', 'a')).toBe('Início');
    expect(
      nameOf(
        '<button><span aria-hidden="true">+</span><span hidden>x</span> Novo</button>',
        'button',
      ),
    ).toBe('Novo');
    expect(nameOf('<button><span role="img" aria-label="Lixeira"></span></button>', 'button')).toBe(
      'Lixeira',
    );
  });

  it('usa o value de input de botão e ignora aria-labelledby vazio', () => {
    expect(nameOf('<input type="submit" value="Enviar" />', 'input')).toBe('Enviar');
    expect(nameOf('<span id="v"></span><button aria-labelledby="v">Ok</button>', 'button')).toBe(
      'Ok',
    );
    expect(nameOf('<div role="progressbar"></div>', 'div')).toBe('');
  });
});
