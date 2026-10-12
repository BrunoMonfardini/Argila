import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { provideArgIcons } from '../icon/icon-registry';
import { argIconMenu } from '../icon/icons.generated';
import { ArgAppShell } from './app-shell';

/** ResizeObserver de mentira: o teste diz qual largura o shell tem. */
class FakeResizeObserver {
  static last: FakeResizeObserver | null = null;
  disconnected = false;
  constructor(private readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.last = this;
  }
  observe(): void {
    this.resize(1200);
  }
  disconnect(): void {
    this.disconnected = true;
  }
  resize(width: number): void {
    this.callback(
      [{ contentRect: { width } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
}

@Component({
  imports: [ArgAppShell],
  template: `
    @if (shown()) {
      <arg-app-shell brandName="Clínica Patas" [brandLogo]="logo()" [brandHref]="href()">
        <button arg-app-shell-actions type="button">Sair</button>
        <nav arg-app-shell-nav aria-label="Principal">
          <a href="/agenda">Agenda</a>
          <a href="/clientes">Clientes</a>
        </nav>
        <h1>Agenda</h1>
      </arg-app-shell>
    }
  `,
})
class Host {
  readonly shell = viewChild(ArgAppShell);
  readonly shown = signal(true);
  readonly logo = signal<string | null>(null);
  readonly href = signal<string | null>(null);
}

describe('ArgAppShell', () => {
  const original = window.ResizeObserver;

  beforeEach(() => {
    window.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
    TestBed.configureTestingModule({ providers: [provideArgIcons([argIconMenu])] });
  });

  afterEach(() => {
    window.ResizeObserver = original;
  });

  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const stable = () => fixture.whenStable();
    const resize = async (width: number) => {
      FakeResizeObserver.last!.resize(width);
      await stable();
    };
    const q = <T extends Element>(selector: string) => root.querySelector<T>(selector);
    return { fixture, host: fixture.componentInstance, root, stable, resize, q };
  }

  it('tem cabeçalho, menu e conteúdo nas regiões nativas', async () => {
    const { q } = await setup();
    expect(q('header')).not.toBeNull();
    expect(q('nav')?.getAttribute('aria-label')).toBe('Principal');
    expect(q('main h1')?.textContent).toBe('Agenda');
    expect(q('.arg-app-shell__actions button')?.textContent).toBe('Sair');
  });

  it('mostra a marca do tenant: nome, logo decorativo e link opcional', async () => {
    const { host, q, stable } = await setup();
    expect(q('.arg-app-shell__name')?.textContent).toBe('Clínica Patas');
    expect(q('img')).toBeNull();
    expect(q('a.arg-app-shell__brand')).toBeNull();

    host.logo.set('logo.svg');
    host.href.set('/');
    await stable();
    expect(q('img')?.getAttribute('alt')).toBe('');
    expect(q<HTMLAnchorElement>('a.arg-app-shell__brand')?.getAttribute('href')).toBe('/');
    expect(accessibleName(q('a.arg-app-shell__brand')!)).toBe('Clínica Patas');
  });

  it('largo: menu fixo na lateral, sem botão de menu nem popover', async () => {
    const { q } = await setup();
    expect(q('.arg-app-shell--compact')).toBeNull();
    expect(q('.arg-app-shell__menu')).toBeNull();
    expect(q('.arg-app-shell__nav')!.hasAttribute('popover')).toBe(false);
  });

  it('estreito: o menu vira gaveta aberta pelo botão do cabeçalho', async () => {
    const { resize, q } = await setup();
    await resize(500);

    const nav = q<HTMLElement>('.arg-app-shell__nav')!;
    const menu = q<HTMLButtonElement>('.arg-app-shell__menu')!;
    expect(q('arg-app-shell')!.classList).toContain('arg-app-shell--compact');
    expect(nav.getAttribute('popover')).toBe('auto');
    expect(accessibleName(menu)).toBe('Abrir menu');
    expect(menu.getAttribute('popovertarget')).toBe(nav.id);
    expect(menu.getAttribute('aria-controls')).toBe(nav.id);
    expect(menu.getAttribute('aria-expanded')).toBe('false');
  });

  it('abrir a gaveta põe o foco no primeiro link; escolher um link fecha', async () => {
    const { host, resize, q, stable } = await setup();
    await resize(500);
    const menu = q<HTMLButtonElement>('.arg-app-shell__menu')!;

    menu.click();
    await stable();
    expect(host.shell()!.navOpen()).toBe(true);
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toBe('Agenda');

    q<HTMLAnchorElement>('nav a')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    await stable();
    expect(host.shell()!.navOpen()).toBe(false);
  });

  it('acompanha o evento toggle nativo (Esc e clique fora fecham)', async () => {
    const { host, resize, q, stable } = await setup();
    await resize(500);
    const nav = q<HTMLElement>('.arg-app-shell__nav')!;
    const toggle = (newState: string) => Object.assign(new Event('toggle'), { newState });

    nav.dispatchEvent(toggle('open'));
    await stable();
    expect(host.shell()!.navOpen()).toBe(true);

    nav.dispatchEvent(toggle('closed'));
    await stable();
    expect(host.shell()!.navOpen()).toBe(false);
  });

  it('ao voltar a ficar largo, a gaveta fecha e o menu volta para a lateral', async () => {
    const { host, resize, q, stable } = await setup();
    await resize(500);
    host.shell()!.openNav();
    await stable();

    await resize(1200);
    expect(host.shell()!.navOpen()).toBe(false);
    expect(q('.arg-app-shell__nav')!.hasAttribute('popover')).toBe(false);
  });

  it('"Pular para o conteúdo" leva o foco ao <main>, sem mudar a URL', async () => {
    const { q } = await setup();
    const skip = q<HTMLAnchorElement>('.arg-app-shell__skip')!;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    skip.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(q('main'));
  });

  it('para de medir quando sai da tela', async () => {
    const { host, stable } = await setup();
    const observer = FakeResizeObserver.last!;
    host.shown.set(false);
    await stable();
    expect(observer.disconnected).toBe(true);
  });

  it('não tem violações de acessibilidade, largo e estreito', async () => {
    const { root, resize } = await setup();
    expect(a11yViolations(root)).toEqual([]);
    await resize(500);
    expect(a11yViolations(root)).toEqual([]);
  });
});
