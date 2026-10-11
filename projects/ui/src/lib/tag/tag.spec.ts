import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgTag } from './tag';

@Component({
  imports: [ArgTag],
  template: `
    <ul aria-label="Filtros">
      <li><arg-tag [removable]="removable()" (removed)="removed = removed + 1">Gatos</arg-tag></li>
      <li><arg-tag removable removeText="Tirar filtro">Hoje</arg-tag></li>
    </ul>
  `,
})
class Host {
  readonly removable = signal(true);
  removed = 0;
}

describe('ArgTag', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const [first, second] = Array.from(root.querySelectorAll('arg-tag'));
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      first,
      button: first.querySelector('button')!,
      other: second.querySelector('button')!,
    };
  }

  function press(button: HTMLButtonElement, key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    button.dispatchEvent(event);
    return event;
  }

  it('o botão de remover se chama "Remover" mais o texto da tag', async () => {
    const { button, other } = await setup();

    expect(button.tagName).toBe('BUTTON');
    expect(accessibleName(button)).toBe('Remover Gatos');
    expect(accessibleName(other)).toBe('Tirar filtro Hoje');
  });

  it('remove pelo clique (e por Enter ou Espaço, que o botão nativo transforma em clique)', async () => {
    const { host, button } = await setup();

    button.click();

    expect(host.removed).toBe(1);
  });

  it('remove por Delete e Backspace, sem apagar nada na página', async () => {
    const { host, button } = await setup();

    const del = press(button, 'Delete');
    const back = press(button, 'Backspace');
    press(button, 'a');

    expect(host.removed).toBe(2);
    expect(del.defaultPrevented).toBe(true);
    expect(back.defaultPrevented).toBe(true);
  });

  it('sem removable, é só o texto', async () => {
    const { fixture, host, first } = await setup();

    host.removable.set(false);
    await fixture.whenStable();

    expect(first.querySelector('button')).toBeNull();
    expect(first.textContent?.trim()).toBe('Gatos');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
