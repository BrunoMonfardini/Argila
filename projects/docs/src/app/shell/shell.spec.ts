import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { DocShell } from './shell';

describe('DocShell', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
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
});
