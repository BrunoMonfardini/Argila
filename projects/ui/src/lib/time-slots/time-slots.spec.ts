import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAnnouncer } from '../internal/announcer';
import { ArgTimeSlot, ArgTimeSlots } from './time-slots';

const SLOTS: ArgTimeSlot[] = [
  { time: '09:00', available: true },
  { time: '09:30', available: false },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
];

@Component({
  imports: [ArgTimeSlots, ReactiveFormsModule, FormField],
  template: `
    <fieldset
      arg-time-slots
      id="reativo"
      label="Horário"
      [slots]="slots()"
      [loading]="loading()"
      [formControl]="time"
    ></fieldset>
    <fieldset
      arg-time-slots
      id="sinais"
      label="Retorno"
      [slots]="slots()"
      [formField]="visit.time"
    ></fieldset>
  `,
})
class Host {
  readonly slots = signal<ArgTimeSlot[]>(SLOTS);
  readonly loading = signal(false);
  readonly time = new FormControl<string | null>('10:00');
  readonly visitModel = signal({ time: null as string | null });
  readonly visit = form(this.visitModel);
}

describe('ArgTimeSlots', () => {
  async function setup() {
    const announce = vi
      .spyOn(TestBed.inject(ArgAnnouncer), 'announce')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const group = root.querySelector<HTMLFieldSetElement>('#reativo')!;
    const radios = () =>
      Array.from(group.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return { host: fixture.componentInstance, root, group, radios, set, announce, fixture };
  }

  afterEach(() => vi.restoreAllMocks());

  it('é um fieldset com legenda e um rádio por horário, no mesmo grupo', async () => {
    const { group, radios } = await setup();
    expect(accessibleName(group)).toBe('Horário');
    expect(radios()).toHaveLength(4);
    expect(new Set(radios().map((r) => r.name)).size).toBe(1);
    expect(radios().map((r) => accessibleName(r))).toEqual([
      '09:00',
      '09:30 , ocupado',
      '10:00',
      '10:30',
    ]);
  });

  it('ocupado fica desabilitado, riscado e tracejado', async () => {
    const { group, radios } = await setup();
    expect(radios()[1].disabled).toBe(true);
    expect(group.querySelectorAll('.arg-time-slots__slot--busy')).toHaveLength(1);
  });

  it('mostra o valor do formulário marcado', async () => {
    const { radios } = await setup();
    expect(radios().map((r) => r.checked)).toEqual([false, false, true, false]);
  });

  it('escolher um horário (as setas também marcam o rádio) atualiza o formulário', async () => {
    const { host, radios, fixture } = await setup();
    radios()[3].checked = true;
    radios()[3].dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(host.time.value).toBe('10:30');
  });

  it('carregando: marcadores ocultos, aria-busy e texto para o leitor; depois anuncia', async () => {
    const { group, radios, set, announce } = await setup();
    await set((h) => h.loading.set(true));
    expect(group.getAttribute('aria-busy')).toBe('true');
    expect(radios()).toHaveLength(0);
    expect(group.querySelector('.arg-time-slots__grid')?.getAttribute('aria-hidden')).toBe('true');
    expect(group.textContent).toContain('Carregando horários…');

    await set((h) => h.loading.set(false));
    expect(group.hasAttribute('aria-busy')).toBe(false);
    expect(announce).toHaveBeenCalledWith('3 horários livres');
  });

  it('sem horários livres, mostra a mensagem e a anuncia ao terminar de carregar', async () => {
    const { group, set, announce } = await setup();
    await set((h) => {
      h.loading.set(true);
      h.slots.set([{ time: '09:00', available: false }]);
    });
    await set((h) => h.loading.set(false));
    expect(group.querySelector('.arg-time-slots__empty')?.textContent).toBe(
      'Nenhum horário livre neste dia.',
    );
    expect(announce).toHaveBeenCalledWith('Nenhum horário livre neste dia.');
  });

  it('Reactive Forms: disable desabilita o grupo; sair do grupo marca como tocado', async () => {
    const { host, group, radios, set } = await setup();
    await set((h) => h.time.disable());
    expect(group.disabled).toBe(true);

    await set((h) => h.time.enable());
    radios()[0].dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: radios()[2] }),
    );
    expect(host.time.touched).toBe(false);
    radios()[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    expect(host.time.touched).toBe(true);
  });

  it('formulários de signals: escolher e valor vindo de fora', async () => {
    const { host, root, set, fixture } = await setup();
    const signals = () =>
      Array.from(root.querySelectorAll<HTMLInputElement>('#sinais input[type="radio"]'));
    signals()[0].checked = true;
    signals()[0].dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(host.visitModel().time).toBe('09:00');

    await set((h) => h.visitModel.set({ time: '10:30' }));
    expect(signals()[3].checked).toBe(true);
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
