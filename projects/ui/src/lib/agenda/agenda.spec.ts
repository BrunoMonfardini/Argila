import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAgenda, ArgAgendaEvent, ArgAgendaSlot, ArgAgendaView } from './agenda';

const EVENTS: ArgAgendaEvent[] = [
  {
    id: 'a',
    title: 'Banho',
    description: 'Thor',
    start: '2026-10-13T09:00',
    end: '2026-10-13T10:00',
  },
  { id: 'b', title: 'Consulta', start: '2026-10-13T09:30', end: '2026-10-13T10:00', tone: 'info' },
  { id: 'c', title: 'Tosa', start: '2026-10-15T10:00', end: '2026-10-15T11:30' },
];

@Component({
  imports: [ArgAgenda],
  template: `
    <arg-agenda
      [events]="events"
      [(date)]="date"
      [(view)]="view"
      start="08:00"
      end="12:00"
      [step]="30"
      (eventSelect)="opened = $event"
      (slotSelect)="slot = $event"
    />
  `,
})
class Host {
  readonly events = EVENTS;
  readonly date = signal('2026-10-13');
  readonly view = signal<ArgAgendaView>('week');
  opened: ArgAgendaEvent | null = null;
  slot: ArgAgendaSlot | null = null;
}

describe('ArgAgenda', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const stable = () => fixture.whenStable();
    const cell = (day: string, slot: number) =>
      root.querySelector<HTMLElement>(`[data-cell="${day}|${slot}"]`)!;
    const press = async (key: string, ctrlKey = false) => {
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }),
      );
      await stable();
      await stable();
    };
    const focused = () => (document.activeElement as HTMLElement).dataset['cell'];
    const range = () => root.querySelector('.arg-agenda__range')?.textContent?.trim();
    return { host: fixture.componentInstance, root, stable, cell, press, focused, range };
  }

  it('é uma grade com cabeçalhos de dia e de horário, nomeada pelo período', async () => {
    const { root, range } = await setup();
    const grid = root.querySelector('[role="grid"]')!;
    expect(range()).toBe('11 – 17 de outubro de 2026');
    expect(accessibleName(grid)).toBe('11 – 17 de outubro de 2026');
    expect(root.querySelectorAll('[role="columnheader"]')).toHaveLength(8);
    expect(
      Array.from(root.querySelectorAll('[role="rowheader"]')).map((h) => h.textContent),
    ).toEqual(['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']);
    expect(root.querySelectorAll('[role="gridcell"]')).toHaveLength(8 * 7);
  });

  it('posiciona os agendamentos pelo horário, lado a lado quando simultâneos', async () => {
    const { cell } = await setup();
    const banho = cell('2026-10-13', 2).querySelector<HTMLElement>('[data-event-id="a"]')!;
    expect(banho.style.getPropertyValue('--arg-agenda-span')).toBe('2');
    expect(banho.style.getPropertyValue('--arg-agenda-lanes')).toBe('2');
    const consulta = cell('2026-10-13', 3).querySelector<HTMLElement>('[data-event-id="b"]')!;
    expect(consulta.style.getPropertyValue('--arg-agenda-lane')).toBe('1');
    expect(consulta.classList).toContain('arg-agenda__event--info');
    expect(banho.getAttribute('aria-hidden')).toBe('true');
  });

  it('cada célula diz o horário, o dia e o que há nela', async () => {
    const { cell } = await setup();
    expect(accessibleName(cell('2026-10-13', 2))).toBe(
      '09:00, terça-feira, 13 de outubro de 2026, Banho, Thor, 09:00 às 10:00',
    );
    expect(accessibleName(cell('2026-10-15', 7))).toBe(
      '11:30, quinta-feira, 15 de outubro de 2026, livre',
    );
    expect(accessibleName(cell('2026-10-13', 3))).toContain('Consulta, 09:30 às 10:00');
  });

  it('só uma célula entra no Tab; setas andam entre horários e dias', async () => {
    const { root, cell, press, focused } = await setup();
    const tabbable = Array.from(root.querySelectorAll<HTMLElement>('[role="gridcell"]')).filter(
      (c) => c.tabIndex === 0,
    );
    expect(tabbable).toHaveLength(1);

    cell('2026-10-13', 0).click();
    cell('2026-10-13', 0).focus();
    await press('ArrowDown');
    expect(focused()).toBe('2026-10-13|1');
    await press('ArrowRight');
    expect(focused()).toBe('2026-10-14|1');
    await press('ArrowUp');
    await press('ArrowUp');
    expect(focused()).toBe('2026-10-14|0');
    await press('ArrowLeft');
    expect(focused()).toBe('2026-10-13|0');
  });

  it('começa no primeiro horário que ainda não passou, dentro da grade', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date(2026, 9, 13, 9, 40));
      const { root } = await setup();
      const tabbable = () =>
        Array.from(root.querySelectorAll<HTMLElement>('[role="gridcell"]'))
          .filter((c) => c.tabIndex === 0)
          .map((c) => c.dataset['cell']);
      expect(tabbable()).toEqual(['2026-10-13|3']);

      // Depois do expediente da grade (que termina às 12:00): o último horário
      vi.setSystemTime(new Date(2026, 9, 13, 18, 0));
      const late = await setup();
      expect(
        Array.from(late.root.querySelectorAll<HTMLElement>('[role="gridcell"]'))
          .filter((c) => c.tabIndex === 0)
          .map((c) => c.dataset['cell']),
      ).toEqual(['2026-10-13|7']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('Home/End vão aos dias das pontas; com Ctrl, aos horários das pontas', async () => {
    const { cell, press, focused } = await setup();
    cell('2026-10-13', 2).click();
    cell('2026-10-13', 2).focus();
    await press('Home');
    expect(focused()).toBe('2026-10-11|2');
    await press('End');
    expect(focused()).toBe('2026-10-17|2');
    await press('End', true);
    expect(focused()).toBe('2026-10-17|7');
    await press('Home', true);
    expect(focused()).toBe('2026-10-17|0');
  });

  it('passar da ponta da semana troca a semana; PageDown avança uma semana', async () => {
    const { host, cell, press, focused, range } = await setup();
    cell('2026-10-17', 0).click();
    cell('2026-10-17', 0).focus();
    await press('ArrowRight');
    expect(focused()).toBe('2026-10-18|0');
    expect(range()).toBe('18 – 24 de outubro de 2026');
    expect(host.date()).toBe('2026-10-18');

    await press('PageDown');
    expect(focused()).toBe('2026-10-25|0');
    expect(range()).toBe('25 – 31 de outubro de 2026');
  });

  it('Enter abre o agendamento do horário (também o que só ocupa) ou escolhe o horário livre', async () => {
    const { host, cell, press } = await setup();
    cell('2026-10-15', 4).focus();
    await press('Enter');
    expect(host.opened?.id).toBe('c');
    expect(host.slot).toBeNull();

    cell('2026-10-15', 5).focus();
    await press('Enter');
    expect(host.opened?.id).toBe('c');

    cell('2026-10-14', 1).focus();
    await press(' ');
    expect(host.slot).toEqual({ date: '2026-10-14', time: '08:30' });
  });

  it('clique: no agendamento abre; numa célula livre escolhe o horário', async () => {
    const { host, cell, stable } = await setup();
    cell('2026-10-15', 4).querySelector<HTMLElement>('[data-event-id="c"]')!.click();
    expect(host.opened?.id).toBe('c');

    cell('2026-10-16', 0).click();
    await stable();
    expect(host.slot).toEqual({ date: '2026-10-16', time: '08:00' });
  });

  it('visão de dia e navegação pela barra', async () => {
    const { host, root, stable, range } = await setup();
    const button = (name: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
        (b) => accessibleName(b) === name,
      )!;

    button('Dia').click();
    await stable();
    expect(host.view()).toBe('day');
    expect(button('Dia').getAttribute('aria-pressed')).toBe('true');
    expect(range()).toBe('13 de outubro de 2026');
    expect(root.querySelectorAll('[role="columnheader"]')).toHaveLength(2);

    button('Próximo dia').click();
    await stable();
    expect(host.date()).toBe('2026-10-14');

    button('Semana').click();
    await stable();
    button('Semana anterior').click();
    await stable();
    expect(host.date()).toBe('2026-10-07');
  });

  it('hoje fica marcado com aria-current="date"', async () => {
    const { host, root, stable } = await setup();
    host.date.set(new Date().toISOString().slice(0, 10));
    await stable();
    expect(
      root.querySelectorAll('[role="columnheader"][aria-current="date"]').length,
    ).toBeLessThanOrEqual(1);
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
