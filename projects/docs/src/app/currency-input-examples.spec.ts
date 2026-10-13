import { TestBed } from '@angular/core/testing';
import { CurrencyInputPriceExample } from '../../../ui/src/lib/currency-input/examples/currency-input-price.example';

/** O exemplo do Currency Input mostra o valor em centavos que o formulário guarda. */
describe('exemplo do Currency Input', () => {
  it('digitar atualiza o valor em centavos', async () => {
    const fixture = TestBed.createComponent(CurrencyInputPriceExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector('input')!;
    const shown = () => root.querySelector('code')?.textContent;

    expect(shown()).toBe('8990');

    input.value = `${input.value}5`;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(shown()).toBe('89905');

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(shown()).toBe('null');
  });
});
