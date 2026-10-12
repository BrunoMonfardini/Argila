import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_BREADCRUMB } from './breadcrumb';

@Component({
  imports: [ARG_BREADCRUMB],
  template: `
    <nav arg-breadcrumb [label]="label()">
      <li arg-breadcrumb-item><a href="/clientes">Clientes</a></li>
      <li arg-breadcrumb-item><a href="/clientes/42">Maria Souza</a></li>
      <li arg-breadcrumb-item current>Thor</li>
    </nav>
  `,
})
class Host {
  readonly label = signal('Trilha de navegação');
}

describe('ArgBreadcrumb', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return {
      root,
      set,
      nav: root.querySelector('nav')!,
      items: Array.from(root.querySelectorAll<HTMLLIElement>('li')),
    };
  }

  it('é um <nav> com nome e uma lista ordenada com os itens', async () => {
    const { nav, items } = await setup();
    expect(accessibleName(nav)).toBe('Trilha de navegação');
    const list = nav.querySelector('ol')!;
    expect(list).not.toBeNull();
    expect(items.every((item) => item.parentElement === list)).toBe(true);
  });

  it('só o item atual tem aria-current="page"', async () => {
    const { items } = await setup();
    expect(items.map((item) => item.getAttribute('aria-current'))).toEqual([null, null, 'page']);
    expect(items[2].classList).toContain('arg-breadcrumb__item--current');
  });

  it('o nome da região pode mudar', async () => {
    const { nav, set } = await setup();
    await set((host) => host.label.set('Você está em'));
    expect(accessibleName(nav)).toBe('Você está em');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
