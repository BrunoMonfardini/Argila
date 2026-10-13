import { TestBed } from '@angular/core/testing';
import { TimeSlotsBookingExample } from '../../../ui/src/lib/time-slots/examples/time-slots-booking.example';

/** O exemplo do Time Slot Picker carrega os horários de cada dia e guarda a escolha. */
describe('exemplo do Time Slot Picker', () => {
  afterEach(() => vi.useRealTimers());

  it('escolher, trocar de dia (carregando) e o dia sem horários livres', async () => {
    const fixture = TestBed.createComponent(TimeSlotsBookingExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const group = root.querySelector('fieldset')!;
    const radios = () =>
      Array.from(group.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const shown = () => root.querySelector('code')?.textContent;
    const day = (name: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('.doc-days button')).find(
        (b) => b.textContent?.trim() === name,
      )!;

    const free = radios().find((radio) => !radio.disabled)!;
    free.checked = true;
    free.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(shown()).toBe(free.value);

    vi.useFakeTimers();
    day('Amanhã').click();
    fixture.detectChanges();
    expect(group.getAttribute('aria-busy')).toBe('true');
    expect(shown()).toBe('null');
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(group.hasAttribute('aria-busy')).toBe(false);
    expect(radios().length).toBe(12);

    day('Quinta-feira').click();
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(group.textContent).toContain('Nenhum horário livre neste dia.');
  });
});
