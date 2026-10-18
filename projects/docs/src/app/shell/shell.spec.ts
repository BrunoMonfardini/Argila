import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ArgTheme, argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { provideDocRouter } from '../app.routes';
import { DocShell } from './shell';

describe('DocShell', () => {
  async function setup() {
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), provideArgIcons(argIconsAll)],
    });
    const fixture = TestBed.createComponent(DocShell);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    // No documento, para o foco e o clique fora funcionarem como no navegador
    document.body.append(root);
    const nav = root.querySelector('nav')!;
    const rail = (label: string) =>
      Array.from(nav.querySelectorAll<HTMLButtonElement>('.doc-rail__item')).find(
        (b) => b.textContent?.trim() === label,
      )!;
    const open = async (label: string) => {
      rail(label).click();
      await fixture.whenStable();
    };
    const links = () => Array.from(nav.querySelectorAll('a'), (a) => a.textContent?.trim());
    return {
      fixture,
      root,
      menu: root.querySelector<HTMLButtonElement>('.doc-shell__menu')!,
      nav,
      rail,
      open,
      links,
    };
  }

  afterEach(() => {
    document.body.replaceChildren();
    TestBed.inject(ArgTheme).setStyle('argila');
    localStorage.clear();
  });

  it('tem link para pular ao conteúdo, navegação nomeada e conteúdo principal', async () => {
    const { root, nav } = await setup();

    expect(root.querySelector('a[href="#conteudo"]')).not.toBeNull();
    expect(nav.getAttribute('aria-label')).toBe('Páginas do catálogo');
    expect(root.querySelector('main#conteudo')).not.toBeNull();
  });

  it('a barra tem um botão por seção, com ícone e rótulo, e o painel começa fechado', async () => {
    const { nav } = await setup();
    const items = Array.from(nav.querySelectorAll('.doc-rail__item'));

    expect(items.map((b) => b.textContent?.trim())).toEqual([
      'Começo',
      'Acessibilidade',
      'Design systems',
      'Fundação',
      'Componentes',
      'Padrões',
      'Templates',
      'Ajuda',
    ]);
    expect(items.filter((b) => !b.querySelector('arg-icon'))).toEqual([]);
    expect(items.filter((b) => b.getAttribute('aria-expanded') !== 'false')).toEqual([]);
    expect(nav.querySelector('.doc-panel')).toBeNull();
  });

  it('abre o painel da seção com a busca focada e as famílias', async () => {
    const { nav, rail, open } = await setup();

    await open('Componentes');

    const panel = nav.querySelector('.doc-panel')!;
    const groups = Array.from(panel.querySelectorAll('.doc-panel__group'), (g) =>
      g.textContent?.trim(),
    );
    expect(rail('Componentes').getAttribute('aria-expanded')).toBe('true');
    expect(rail('Componentes').getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-label')).toBe('Componentes');
    expect(document.activeElement).toBe(panel.querySelector('input[type="search"]'));
    expect(groups.slice(0, 3)).toEqual(['Ações', 'Formulário', 'Seleção']);
  });

  it('o mesmo botão fecha o painel; outro botão troca a seção', async () => {
    const { nav, open, links } = await setup();

    await open('Templates');
    expect(links()).toContain('Sobre templates');
    await open('Design systems');
    expect(links()).toEqual([
      'Sobre design systems',
      'Argila',
      'CODA',
      'Transparente',
      'Windows XP',
      'Neo-brutalista',
      'Punk',
    ]);
    await open('Design systems');
    expect(nav.querySelector('.doc-panel')).toBeNull();
  });

  it('fecha o painel com Esc e devolve o foco ao botão', async () => {
    const { fixture, nav, rail, open } = await setup();
    await open('Fundação');

    nav
      .querySelector('input[type="search"]')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    expect(nav.querySelector('.doc-panel')).toBeNull();
    expect(document.activeElement).toBe(rail('Fundação'));
  });

  it('fecha o painel com clique fora, mas não com clique dentro', async () => {
    const { fixture, root, nav, open } = await setup();
    await open('Fundação');

    nav.querySelector<HTMLElement>('.doc-panel__title')!.click();
    await fixture.whenStable();
    expect(nav.querySelector('.doc-panel')).not.toBeNull();

    root.querySelector<HTMLElement>('main')!.click();
    await fixture.whenStable();
    expect(nav.querySelector('.doc-panel')).toBeNull();
  });

  it('abre e fecha a gaveta no celular pelo botão', async () => {
    const { fixture, menu, nav } = await setup();
    expect(menu.getAttribute('aria-expanded')).toBe('false');

    menu.click();
    await fixture.whenStable();

    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('aria-controls')).toBe(nav.id);
    expect(nav.classList).toContain('doc-shell__nav--open');
  });

  it('seguir um link fecha o painel e a gaveta', async () => {
    const { fixture, menu, nav, open } = await setup();
    menu.click();
    await open('Começo');

    nav.querySelector('a')!.click();
    await fixture.whenStable();

    expect(nav.querySelector('.doc-panel')).toBeNull();
    expect(nav.classList).not.toContain('doc-shell__nav--open');
  });

  it('marca a seção e o link da página atual', async () => {
    const { fixture, nav, rail, open } = await setup();

    await TestBed.inject(Router).navigateByUrl('/fundacao/icones');
    await fixture.whenStable();
    await open('Fundação');

    expect(rail('Fundação').classList).toContain('doc-rail__item--current');
    expect(rail('Começo').classList).not.toContain('doc-rail__item--current');
    expect(nav.querySelector('a[aria-current="page"]')?.textContent?.trim()).toBe('Ícones');
  });

  it('a busca procura em todo o catálogo e avisa quando não acha nada', async () => {
    const { fixture, nav, open, links } = await setup();
    await open('Fundação');
    const search = nav.querySelector<HTMLInputElement>('input[type="search"]')!;

    search.value = 'inexistente';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(nav.querySelector('[role="status"]')?.textContent).toContain('Nada encontrado');

    search.value = 'icon button';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(links()).toEqual(['Icon Button']);
  });

  it('abre a página do Button pelo painel, com os exemplos renderizados', async () => {
    const { fixture, root, nav, open } = await setup();
    await open('Componentes');
    const link = Array.from(nav.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'Button',
    )!;

    link.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/componentes/button');
    expect(root.querySelector('main h1')?.textContent).toBe('Button');
    expect(
      root.querySelectorAll('main .doc-example__preview button[arg-button]').length,
    ).toBeGreaterThan(4);
  });

  it('a navegação acompanha o DS: fora e exclusivos de outros somem', async () => {
    const { fixture, open, links } = await setup();
    await open('Componentes');
    expect(links()).toContain('Agenda');
    expect(links()).not.toContain('Janela (Windows XP)');

    TestBed.inject(ArgTheme).setStyle('windows-xp');
    await fixture.whenStable();

    expect(links()).not.toContain('Agenda');
    expect(links()).toContain('Janela (Windows XP)');
    expect(links()).toContain('Button');
  });

  it('o link da página fica ativo também nas abas dela', async () => {
    const { fixture, nav, open } = await setup();

    await TestBed.inject(Router).navigateByUrl('/componentes/button/codigo');
    await fixture.whenStable();
    await open('Componentes');

    expect(nav.querySelector('a[aria-current="page"]')?.textContent?.trim()).toBe('Button');
  });

  it('link com escolha de tema inválida mostra o aviso, que dá para fechar', async () => {
    history.replaceState(null, '', '/?ds=punk&paleta=terrosa');
    const { fixture, root } = await setup();
    history.replaceState(null, '', '/');
    const alert = () => root.querySelector('.doc-shell__notice');

    expect(alert()?.textContent).toContain('O Punk não aceita a paleta “terrosa”');

    alert()!.querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();
    expect(alert()).toBeNull();
  });

  it('o endereço antigo de Fundamentos leva à Fundação', async () => {
    const { fixture } = await setup();

    await TestBed.inject(Router).navigateByUrl('/fundamentos/tokens');
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/fundacao/tokens');
  });
});
