import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_MENU, ArgMenu } from './menu';

@Component({
  imports: [ARG_MENU],
  template: `
    <button type="button" [argMenuTrigger]="menu">Ações</button>
    <arg-menu #menu>
      <button arg-menu-item (click)="chosen = 'Remarcar'">Remarcar</button>
      <button arg-menu-item (click)="chosen = 'Duplicar'">Duplicar</button>
      <button arg-menu-item disabled>Cobrar</button>
      <hr />
      <button arg-menu-item tone="danger" (click)="chosen = 'Excluir'">Excluir</button>
    </arg-menu>
    <button type="button" id="depois">Depois</button>
  `,
})
class Host {
  readonly menu = viewChild.required(ArgMenu);
  chosen = '';
}

describe('ArgMenu', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const trigger = root.querySelector<HTMLButtonElement>('button')!;
    const panel = root.querySelector<HTMLElement>('arg-menu')!;
    const items = Array.from(panel.querySelectorAll<HTMLButtonElement>('[arg-menu-item]'));
    const press = (target: HTMLElement, key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      target.dispatchEvent(event);
      return event;
    };
    const stable = () => fixture.whenStable();
    return { fixture, host: fixture.componentInstance, root, trigger, panel, items, press, stable };
  }

  it('gatilho e menu têm os papéis e as ligações do padrão menu button', async () => {
    const { trigger, panel, items } = await setup();

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(trigger.getAttribute('popovertarget')).toBe(panel.id);
    expect(panel.getAttribute('role')).toBe('menu');
    expect(panel.getAttribute('popover')).toBe('auto');
    expect(items.every((item) => item.getAttribute('role') === 'menuitem')).toBe(true);
    expect(items[3].classList).toContain('arg-menu__item--danger');
  });

  it('o clique abre com o foco no primeiro item, e o menu leva o nome do botão', async () => {
    const { trigger, panel, items, stable } = await setup();

    trigger.click();
    await stable();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(items[0]);
    expect(accessibleName(panel)).toBe('Ações');
  });

  it('seta para baixo abre no primeiro item; seta para cima, no último', async () => {
    const { host, trigger, items, press, stable } = await setup();

    const down = press(trigger, 'ArrowDown');
    await stable();
    expect(down.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[0]);

    host.menu().hide();
    await stable();
    press(trigger, 'ArrowUp');
    await stable();
    expect(document.activeElement).toBe(items[4 - 1]);
  });

  it('setas andam e dão a volta, pulando o item desabilitado; Home e End vão às pontas', async () => {
    const { trigger, items, press, stable } = await setup();
    trigger.click();
    await stable();

    press(items[0], 'ArrowDown');
    expect(document.activeElement).toBe(items[1]);
    press(items[1], 'ArrowDown');
    expect(document.activeElement).toBe(items[3]);
    press(items[3], 'ArrowDown');
    expect(document.activeElement).toBe(items[0]);
    press(items[0], 'ArrowUp');
    expect(document.activeElement).toBe(items[3]);

    press(items[3], 'Home');
    expect(document.activeElement).toBe(items[0]);
    press(items[0], 'End');
    expect(document.activeElement).toBe(items[3]);
  });

  it('digitar letras leva ao item que começa com elas', async () => {
    const first = await setup();
    first.trigger.click();
    await first.stable();
    first.press(first.items[0], 'e');
    expect(document.activeElement).toBe(first.items[3]);

    const second = await setup();
    second.trigger.click();
    await second.stable();
    // Letras em sequência formam uma busca só: "du" continua em "Duplicar"
    second.press(second.items[0], 'd');
    expect(document.activeElement).toBe(second.items[1]);
    second.press(second.items[1], 'u');
    expect(document.activeElement).toBe(second.items[1]);
  });

  it('Esc fecha e devolve o foco ao botão', async () => {
    const { host, trigger, items, press, stable } = await setup();
    trigger.click();
    await stable();

    const esc = press(items[1], 'Escape');
    await stable();

    expect(esc.defaultPrevented).toBe(true);
    expect(host.menu().isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('escolher um item executa a ação, fecha e devolve o foco', async () => {
    const { host, trigger, items, stable } = await setup();
    trigger.click();
    await stable();

    items[1].click();
    await stable();

    expect(host.chosen).toBe('Duplicar');
    expect(host.menu().isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('Tab fecha o menu', async () => {
    const { host, trigger, items, press, stable } = await setup();
    trigger.click();
    await stable();

    const tab = press(items[0], 'Tab');
    await stable();

    expect(tab.defaultPrevented).toBe(false);
    expect(host.menu().isOpen()).toBe(false);
  });

  it('o gatilho ganha um id se não tiver, sem trocar o que já tem', async () => {
    const { trigger } = await setup();
    expect(trigger.id).toMatch(/^arg-menu-trigger-/);
  });

  it('não tem violações de acessibilidade, aberto', async () => {
    const { root, trigger, stable } = await setup();
    trigger.click();
    await stable();
    expect(a11yViolations(root)).toEqual([]);
  });
});
