import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideDocRouter } from '../app.routes';
import { DocShell } from './shell';

describe('DocShell', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideDocRouter()] });
    const fixture = TestBed.createComponent(DocShell);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      root,
      menu: root.querySelector<HTMLButtonElement>('.doc-shell__menu')!,
      nav: root.querySelector('nav')!,
    };
  }

  it('tem link para pular ao conteúdo, navegação nomeada e conteúdo principal', async () => {
    const { root, nav } = await setup();

    expect(root.querySelector('a[href="#conteudo"]')).not.toBeNull();
    expect(nav.getAttribute('aria-label')).toBe('Páginas do catálogo');
    expect(root.querySelector('main#conteudo')).not.toBeNull();
  });

  it('abre e fecha o menu no celular pelo botão', async () => {
    const { fixture, menu, nav } = await setup();
    expect(menu.getAttribute('aria-expanded')).toBe('false');

    menu.click();
    await fixture.whenStable();

    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('aria-controls')).toBe(nav.id);
    expect(nav.classList).toContain('doc-shell__nav--open');
  });

  it('fecha o menu ao seguir um link da barra lateral', async () => {
    const { fixture, menu, nav } = await setup();
    menu.click();
    await fixture.whenStable();

    nav.querySelector('a')!.click();
    await fixture.whenStable();

    expect(nav.classList).not.toContain('doc-shell__nav--open');
  });

  it('marca o link da página atual com aria-current', async () => {
    const { fixture, root } = await setup();

    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();

    const current = root.querySelector('nav a[aria-current="page"]');

    expect(current?.textContent?.trim()).toBe('Início');
  });

  it('filtra a barra lateral pela busca e avisa quando não acha nada', async () => {
    const { fixture, nav } = await setup();
    const search = nav.querySelector<HTMLInputElement>('input[type="search"]')!;

    search.value = 'botao';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(nav.querySelector('[role="status"]')?.textContent).toContain('Nada encontrado');

    search.value = 'button';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    const labels = Array.from(nav.querySelectorAll('a'), (a) => a.textContent?.trim());
    expect(labels).toEqual(['Button']);
  });

  it('abre a página do Button pela barra lateral, com os exemplos renderizados', async () => {
    const { fixture, root, nav } = await setup();
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
});
