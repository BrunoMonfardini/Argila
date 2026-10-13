import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_FIELD } from '../field/field';
import { ArgDateInput, IsoDate, weekday } from './date-input';

const sunday = (iso: IsoDate) => weekday(iso) === 0;

@Component({
  imports: [ArgDateInput, ARG_FIELD, ReactiveFormsModule, FormField],
  template: `
    <arg-field label="Data do banho">
      <input
        arg-date
        id="reativo"
        [formControl]="date"
        [min]="min()"
        [max]="max()"
        [blocked]="blocked"
      />
    </arg-field>
    <arg-field label="Retorno">
      <input arg-date id="sinais" [formField]="visit.back" />
    </arg-field>
  `,
})
class Host {
  readonly date = new FormControl<IsoDate | null>('2026-10-13');
  readonly min = signal<IsoDate | undefined>('2026-10-05');
  readonly max = signal<IsoDate | undefined>('2026-12-31');
  readonly blocked = sunday;
  readonly visitModel = signal({ back: null as IsoDate | null });
  readonly visit = form(this.visitModel);
}

describe('ArgDateInput', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const stable = () => fixture.whenStable();
    const type = async (input: HTMLInputElement, text: string) => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
      await stable();
    };
    const reactive = root.querySelector<HTMLInputElement>('#reativo')!;
    const toggle = () =>
      reactive.nextElementSibling!.querySelector<HTMLButtonElement>('.arg-date-toggle__button')!;
    const dialog = () => reactive.nextElementSibling!.querySelector('dialog')!;
    const cell = (iso: string) => dialog().querySelector<HTMLElement>(`[data-date="${iso}"]`)!;
    const press = async (key: string, shiftKey = false) => {
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
      );
      await stable();
      await stable();
    };
    const openCalendar = async () => {
      toggle().click();
      await stable();
      await Promise.resolve();
      await stable();
    };
    return {
      host: fixture.componentInstance,
      root,
      stable,
      type,
      reactive,
      signals: root.querySelector<HTMLInputElement>('#sinais')!,
      toggle,
      dialog,
      cell,
      press,
      openCalendar,
    };
  }

  it('é um input de texto com rótulo, formato e o botão do calendário logo depois', async () => {
    const { reactive, toggle } = await setup();
    expect(accessibleName(reactive)).toBe('Data do banho');
    expect(reactive.placeholder).toBe('dd/mm/aaaa');
    expect(reactive.getAttribute('inputmode')).toBe('numeric');
    expect(reactive.nextElementSibling?.localName).toBe('arg-date-toggle');
    expect(accessibleName(toggle())).toBe('Mudar a data, terça-feira, 13 de outubro de 2026');
  });

  it('mostra o valor do formulário (ISO) no formato brasileiro', async () => {
    const { reactive } = await setup();
    expect(reactive.value).toBe('13/10/2026');
  });

  it('digitar põe as barras sozinho e o formulário recebe a data em ISO', async () => {
    const { host, reactive, type } = await setup();
    await type(reactive, '1510');
    expect(reactive.value).toBe('15/10');
    expect(host.date.value).toBeNull();
    expect(host.date.errors).toEqual({ incomplete: true });

    await type(reactive, '15102026');
    expect(reactive.value).toBe('15/10/2026');
    expect(host.date.value).toBe('2026-10-15');
    expect(host.date.errors).toBeNull();
  });

  it('valida data inexistente, limites e dias bloqueados', async () => {
    const { host, reactive, type } = await setup();
    await type(reactive, '31/02/2026');
    expect(host.date.errors).toEqual({ date: true });

    await type(reactive, '01/10/2026');
    expect(host.date.errors).toEqual({ dateMin: { min: '2026-10-05' } });

    await type(reactive, '01/01/2027');
    expect(host.date.errors).toEqual({ dateMax: { max: '2026-12-31' } });

    // 18/10/2026 é domingo
    await type(reactive, '18/10/2026');
    expect(host.date.errors).toEqual({ dateBlocked: true });

    await type(reactive, '');
    expect(host.date.value).toBeNull();
    expect(host.date.errors).toBeNull();
  });

  it('o calendário abre no mês da data, com o foco nela', async () => {
    const { dialog, cell, openCalendar } = await setup();
    await openCalendar();

    expect(dialog().hasAttribute('open')).toBe(true);
    expect(dialog().querySelector('h2')?.textContent).toBe('outubro de 2026');
    expect(document.activeElement).toBe(cell('2026-10-13'));
    expect(cell('2026-10-13').getAttribute('aria-selected')).toBe('true');
    expect(cell('2026-10-13').tabIndex).toBe(0);
    expect(cell('2026-10-14').tabIndex).toBe(-1);
    expect(accessibleName(dialog().querySelector('[role="grid"]')!)).toBe('outubro de 2026');
  });

  it('teclado: setas, Home/End e PageUp/PageDown (com Shift, ano)', async () => {
    const { dialog, press, openCalendar } = await setup();
    await openCalendar();
    const focused = () => (document.activeElement as HTMLElement).dataset['date'];

    await press('ArrowRight');
    expect(focused()).toBe('2026-10-14');
    await press('ArrowDown');
    expect(focused()).toBe('2026-10-21');
    await press('ArrowLeft');
    await press('ArrowUp');
    expect(focused()).toBe('2026-10-13');
    await press('Home');
    expect(focused()).toBe('2026-10-11');
    await press('End');
    expect(focused()).toBe('2026-10-17');

    await press('PageDown');
    expect(focused()).toBe('2026-11-17');
    expect(dialog().querySelector('h2')?.textContent).toBe('novembro de 2026');
    await press('PageUp', true);
    expect(focused()).toBe('2025-11-17');
  });

  it('Enter escolhe a data, fecha e devolve o foco ao botão', async () => {
    const { host, reactive, toggle, dialog, press, openCalendar } = await setup();
    await openCalendar();
    await press('ArrowRight');
    await press('Enter');

    expect(host.date.value).toBe('2026-10-14');
    expect(reactive.value).toBe('14/10/2026');
    expect(dialog().hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(toggle());
  });

  it('Esc fecha sem escolher e devolve o foco ao botão', async () => {
    const { host, toggle, dialog, openCalendar, stable } = await setup();
    await openCalendar();

    const cancel = new Event('cancel', { cancelable: true });
    dialog().dispatchEvent(cancel);
    await stable();

    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog().hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(toggle());
    expect(host.date.value).toBe('2026-10-13');
  });

  it('dia bloqueado e fora dos limites: riscado, aria-disabled e não escolhe', async () => {
    const { host, cell, openCalendar } = await setup();
    await openCalendar();

    const sundayCell = cell('2026-10-18');
    expect(sundayCell.getAttribute('aria-disabled')).toBe('true');
    expect(sundayCell.classList).toContain('arg-calendar__day--blocked');
    expect(cell('2026-10-01').getAttribute('aria-disabled')).toBe('true');

    sundayCell.click();
    expect(host.date.value).toBe('2026-10-13');
  });

  it('clique numa data escolhe; os botões de mês trocam o mês', async () => {
    const { host, dialog, cell, openCalendar, stable } = await setup();
    await openCalendar();

    dialog().querySelector<HTMLButtonElement>('[aria-label="Próximo mês"]')!.click();
    await stable();
    expect(dialog().querySelector('h2')?.textContent).toBe('novembro de 2026');

    cell('2026-11-20').click();
    await stable();
    expect(host.date.value).toBe('2026-11-20');
  });

  it('formulários de signals: digitação e valor vindo de fora', async () => {
    const { host, signals, type, stable } = await setup();
    await type(signals, '20112026');
    expect(host.visitModel().back).toBe('2026-11-20');

    host.visitModel.set({ back: '2026-12-01' });
    await stable();
    expect(signals.value).toBe('01/12/2026');
  });

  it('desabilitar o campo desabilita o botão do calendário', async () => {
    const { host, reactive, toggle, stable } = await setup();
    host.date.disable();
    await stable();
    expect(reactive.disabled).toBe(true);
    expect(toggle().disabled).toBe(true);
  });

  it('não tem violações de acessibilidade, fechado e aberto', async () => {
    const { root, openCalendar } = await setup();
    expect(a11yViolations(root)).toEqual([]);
    await openCalendar();
    expect(a11yViolations(root)).toEqual([]);
  });
});
