import { RovingFocus, RovingFocusOptions } from './roving-focus';

describe('RovingFocus', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
  });

  afterEach(() => root.remove());

  function setup(labels: string[], options: Partial<RovingFocusOptions> = {}) {
    root.innerHTML = labels
      .map((label) =>
        label.startsWith('~')
          ? `<button type="button" disabled>${label.slice(1)}</button>`
          : `<button type="button">${label}</button>`,
      )
      .join('');
    const items = Array.from(root.querySelectorAll('button'));
    const roving = new RovingFocus({ items: () => items, ...options });
    roving.setActive(0);
    const press = (key: string, init: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent('keydown', { key, cancelable: true, ...init });
      const handled = roving.handleKeydown(event);
      return { handled, prevented: event.defaultPrevented };
    };
    const focused = () => document.activeElement?.textContent;
    return { items, roving, press, focused };
  }

  it('deixa só o item ativo na ordem de tabulação', () => {
    const { items } = setup(['A', 'B', 'C']);

    expect(items.map((item) => item.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('anda com as setas da orientação e impede a rolagem da página', () => {
    const { roving, items, press, focused } = setup(['A', 'B', 'C']);

    expect(press('ArrowDown')).toEqual({ handled: true, prevented: true });
    expect(focused()).toBe('B');
    expect(roving.activeIndex).toBe(1);
    expect(items[1].getAttribute('tabindex')).toBe('0');

    press('ArrowUp');
    expect(focused()).toBe('A');
  });

  it('ignora setas de outra orientação e teclas com modificador', () => {
    const { press, roving } = setup(['A', 'B']);

    expect(press('ArrowRight')).toEqual({ handled: false, prevented: false });
    expect(press('ArrowDown', { ctrlKey: true }).handled).toBe(false);
    expect(press('Enter').handled).toBe(false);
    expect(roving.activeIndex).toBe(0);
  });

  it('volta ao começo no fim da lista, ou para na ponta sem laço', () => {
    const comLaco = setup(['A', 'B']);
    comLaco.press('ArrowUp');
    expect(comLaco.focused()).toBe('B');

    const semLaco = setup(['A', 'B'], { loop: false });
    semLaco.press('ArrowUp');
    expect(semLaco.roving.activeIndex).toBe(0);
    semLaco.press('ArrowDown');
    semLaco.press('ArrowDown');
    expect(semLaco.focused()).toBe('B');
  });

  it('pula itens desabilitados, também com Home e End', () => {
    const { press, focused } = setup(['A', '~B', 'C', '~D']);

    press('ArrowDown');
    expect(focused()).toBe('C');
    press('ArrowDown');
    expect(focused()).toBe('A');
    press('End');
    expect(focused()).toBe('C');
    press('Home');
    expect(focused()).toBe('A');
  });

  it('não sai do lugar quando todos os outros estão desabilitados', () => {
    const { press, roving } = setup(['A', '~B', '~C']);

    press('ArrowDown');

    expect(roving.activeIndex).toBe(0);
  });

  it('na horizontal, inverte as setas em páginas da direita para a esquerda', () => {
    root.setAttribute('dir', 'rtl');
    const { press, focused } = setup(['A', 'B', 'C'], { orientation: 'horizontal' });

    press('ArrowLeft');
    expect(focused()).toBe('B');
    press('ArrowRight');
    expect(focused()).toBe('A');
    root.removeAttribute('dir');
  });

  it('em both, aceita as quatro setas', () => {
    const { press, focused } = setup(['A', 'B', 'C'], { orientation: 'both' });

    press('ArrowRight');
    expect(focused()).toBe('B');
    press('ArrowDown');
    expect(focused()).toBe('C');
    press('ArrowLeft');
    expect(focused()).toBe('B');
  });

  it('busca por letra: inicial, várias letras e a mesma letra repetida', () => {
    let now = 1000;
    const { press, focused } = setup(['Editar', 'Duplicar', 'Excluir', 'Ícone', 'Exportar'], {
      typeahead: true,
      now: () => now,
    });

    press('e');
    expect(focused()).toBe('Excluir');
    now += 100;
    press('x');
    now += 100;
    press('p');
    expect(focused()).toBe('Exportar');

    now += 1000;
    press('i');
    expect(focused()).toBe('Ícone');

    now += 1000;
    press('e');
    expect(focused()).toBe('Exportar');
    now += 100;
    press('e');
    // A mesma letra de novo anda para o próximo com "e", dando a volta na lista
    expect(focused()).toBe('Editar');
  });

  it('busca por letra ignora espaço e o que não encontra', () => {
    const { press, roving } = setup(['A', 'B'], { typeahead: true });

    expect(press(' ').handled).toBe(false);
    expect(press('z').handled).toBe(false);
    expect(roving.activeIndex).toBe(0);
  });

  it('sem busca por letra, letras não fazem nada', () => {
    const { press } = setup(['A', 'B']);

    expect(press('b').handled).toBe(false);
  });

  it('avisa a mudança e limita o índice ao tamanho da lista', () => {
    const changes: number[] = [];
    const { roving } = setup(['A', 'B'], { onActiveChange: (index) => changes.push(index) });

    roving.setActive(9);

    expect(roving.activeIndex).toBe(1);
    expect(changes).toEqual([0, 1]);
  });

  it('com a lista vazia, não faz nada', () => {
    const roving = new RovingFocus({ items: () => [] });
    roving.setActive(1);

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });

    expect(roving.handleKeydown(event)).toBe(false);
    expect(roving.activeIndex).toBe(0);
  });
});
