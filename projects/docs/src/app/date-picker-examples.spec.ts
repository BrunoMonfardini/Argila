import { TestBed } from '@angular/core/testing';
import { addDays, formatBr, todayIso, weekday } from '@brunomonfardini/ui';
import { DatePickerBookingExample } from '../../../ui/src/lib/date-picker/examples/date-picker-booking.example';

/** O exemplo do Date Picker explica cada erro e aceita um dia de atendimento. */
describe('exemplo do Date Picker', () => {
  async function setup() {
    const fixture = TestBed.createComponent(DatePickerBookingExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector('input')!;
    const fill = async (text: string) => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    const error = () => root.querySelector('.arg-field__error')?.textContent?.trim() ?? null;
    return { root, fill, error };
  }

  it('mostra o motivo de cada erro', async () => {
    const { fill, error } = await setup();
    await fill('');
    expect(error()).toBe('Escolha uma data.');
    await fill('1510');
    expect(error()).toBe('Data incompleta: use dd/mm/aaaa.');
    await fill('31022026');
    expect(error()).toBe('Essa data não existe.');
    await fill(formatBr(addDays(todayIso(), -1)));
    expect(error()).toBe(`Escolha a partir de ${formatBr(todayIso())}.`);
    await fill(formatBr(addDays(todayIso(), 61)));
    expect(error()).toBe(`Escolha até ${formatBr(addDays(todayIso(), 60))}.`);
  });

  it('domingo é bloqueado; dia de semana passa', async () => {
    const { root, fill, error } = await setup();
    let day = addDays(todayIso(), 1);
    while (weekday(day) !== 0) day = addDays(day, 1);
    await fill(formatBr(day));
    expect(error()).toBe('Não atendemos nesse dia: escolha outro.');

    await fill(formatBr(addDays(day, 1)));
    expect(error()).toBeNull();
    expect(root.querySelector('code')?.textContent).toBe(addDays(day, 1));
  });
});
