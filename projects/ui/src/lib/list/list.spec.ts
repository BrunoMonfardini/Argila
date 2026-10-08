import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ARG_LIST } from './list';
import { a11yViolations } from '../../testing/a11y';

@Component({
  imports: [ARG_LIST],
  template: `
    <ul arg-list [divided]="divided()" [bordered]="bordered()">
      <li arg-list-item id="simples">
        <span arg-list-leading>●</span>
        <span arg-list-title>Maria Souza</span>
        <span arg-list-description>maria@exemplo.com</span>
        <span arg-list-trailing>Admin</span>
      </li>
      <li arg-list-item id="interativo">
        <button arg-list-action type="button" (click)="clicks = clicks + 1">
          <span arg-list-title>Abrir pedido</span>
        </button>
      </li>
    </ul>
  `,
})
class Host {
  readonly divided = signal(false);
  readonly bordered = signal(false);
  clicks = 0;
}

describe('ArgList', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      list: root.querySelector('ul')!,
      simple: root.querySelector<HTMLLIElement>('#simples')!,
      interactive: root.querySelector<HTMLLIElement>('#interativo')!,
    };
  }

  it('aplica classes de lista e de item', async () => {
    const { list, simple } = await setup();
    expect(list.classList).toContain('arg-list');
    expect(simple.classList).toContain('arg-list__item');
  });

  it('liga divided e bordered por classe', async () => {
    const { fixture, host, list } = await setup();
    expect(list.classList).not.toContain('arg-list--divided');
    host.divided.set(true);
    host.bordered.set(true);
    await fixture.whenStable();
    expect(list.classList).toContain('arg-list--divided');
    expect(list.classList).toContain('arg-list--bordered');
  });

  it('projeta leading e trailing fora do corpo do item', async () => {
    const { simple } = await setup();
    const [leading, body, trailing] = Array.from(simple.children);
    expect(leading.hasAttribute('arg-list-leading')).toBe(true);
    expect(body.classList).toContain('arg-list__body');
    expect(body.querySelector('[arg-list-title]')?.textContent).toBe('Maria Souza');
    expect(trailing.hasAttribute('arg-list-trailing')).toBe(true);
  });

  it('marca o item como interativo quando contém uma ação', async () => {
    const { simple, interactive } = await setup();
    expect(simple.classList).not.toContain('arg-list__item--interactive');
    expect(interactive.classList).toContain('arg-list__item--interactive');
  });

  it('mantém o botão nativo clicável', async () => {
    const { host, interactive } = await setup();
    const action = interactive.querySelector('button')!;
    expect(action.classList).toContain('arg-list__action');
    action.click();
    expect(host.clicks).toBe(1);
  });

  it('não tem violações de acessibilidade, simples ou com borda e divisões', async () => {
    const { fixture, host } = await setup();
    expect(a11yViolations(fixture.nativeElement)).toEqual([]);

    host.divided.set(true);
    host.bordered.set(true);
    await fixture.whenStable();
    expect(a11yViolations(fixture.nativeElement)).toEqual([]);
  });
});
