import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_POPOVER, ArgPopover } from './popover';

@Component({
  imports: [ARG_POPOVER],
  template: `
    <button type="button" [argPopoverTrigger]="pop">Detalhes</button>
    <arg-popover #pop label="Detalhes do pet" (openChange)="changes.push($event)">
      <p>Golden retriever</p>
      <button type="button" (click)="pop.hide()">Fechar</button>
    </arg-popover>
  `,
})
class Host {
  readonly popover = viewChild.required(ArgPopover);
  readonly changes: boolean[] = [];
}

describe('ArgPopover', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      trigger: root.querySelector<HTMLButtonElement>('button')!,
      panel: root.querySelector<HTMLElement>('arg-popover')!,
    };
  }

  it('o painel é um popover auto com role dialog e nome', async () => {
    const { panel } = await setup();
    expect(panel.getAttribute('popover')).toBe('auto');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(accessibleName(panel)).toBe('Detalhes do pet');
    expect(panel.classList).toContain('arg-popover--bottom-start');
  });

  it('o gatilho aponta para o painel com popovertarget e aria', async () => {
    const { trigger, panel } = await setup();
    expect(trigger.getAttribute('popovertarget')).toBe(panel.id);
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('o clique no gatilho abre e fecha, e aria-expanded acompanha', async () => {
    const { fixture, host, trigger } = await setup();

    trigger.click();
    await fixture.whenStable();
    expect(host.popover().isOpen()).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.click();
    await fixture.whenStable();
    expect(host.popover().isOpen()).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(host.changes).toEqual([true, false]);
  });

  it('hide() por código, de dentro do painel', async () => {
    const { fixture, host, trigger, panel } = await setup();
    trigger.click();
    await fixture.whenStable();

    panel.querySelector('button')!.click();
    await fixture.whenStable();

    expect(host.popover().isOpen()).toBe(false);
  });

  it('acompanha o evento toggle nativo do navegador', async () => {
    const { fixture, host, panel } = await setup();
    const toggle = (newState: string) =>
      Object.assign(new Event('toggle'), {
        newState,
        oldState: newState === 'open' ? 'closed' : 'open',
      });

    panel.dispatchEvent(toggle('open'));
    await fixture.whenStable();
    expect(host.popover().isOpen()).toBe(true);

    // Clique fora ou Esc: o navegador fecha e dispara toggle
    panel.dispatchEvent(toggle('closed'));
    await fixture.whenStable();
    expect(host.popover().isOpen()).toBe(false);
  });

  it('o gatilho recebe o anchor-name que o painel usa', async () => {
    const { trigger, panel, host } = await setup();
    const name = host.popover().anchorName;
    expect(name).toBe(`--${panel.id}`);
    expect(trigger.style.getPropertyValue('anchor-name') || name).toBe(name);
  });

  it('não tem violações de acessibilidade, fechado e aberto', async () => {
    const { fixture, root, trigger } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    trigger.click();
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });
});
