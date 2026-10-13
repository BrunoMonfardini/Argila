import { TestBed } from '@angular/core/testing';
import { ComboboxSearchExample } from '../../../ui/src/lib/combobox/examples/combobox-search.example';

/** O exemplo do Combobox escolhe da lista local e da busca simulada. */
describe('exemplo do Combobox', () => {
  afterEach(() => vi.useRealTimers());

  it('escolhe um serviço e um tutor buscado', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(ComboboxSearchExample);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const [service, tutor] = Array.from(root.querySelectorAll<HTMLInputElement>('input'));
    const type = async (input: HTMLInputElement, text: string) => {
      input.focus();
      input.value = text;
      input.dispatchEvent(new Event('input'));
      // 250 ms de espera entre teclas + 600 ms da busca simulada
      await vi.advanceTimersByTimeAsync(1000);
      fixture.detectChanges();
    };
    const press = async (input: HTMLInputElement, key: string) => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();
    };
    const values = () => Array.from(root.querySelectorAll('code')).map((c) => c.textContent);

    await type(service, 'tosa');
    await press(service, 'ArrowDown');
    await press(service, 'Enter');
    expect(service.value).toBe('Tosa higiênica');

    await type(tutor, 'm');
    expect(tutor.getAttribute('aria-expanded')).toBe('false');
    await type(tutor, 'mar');
    await press(tutor, 'ArrowDown');
    await press(tutor, 'Enter');
    expect(tutor.value).toBe('Maria Souza');
    expect(values()).toEqual(['tosa', 't1']);
  });
});
