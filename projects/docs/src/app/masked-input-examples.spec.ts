import { TestBed } from '@angular/core/testing';
import { MaskedInputClientExample } from '../../../ui/src/lib/masked-input/examples/masked-input-client.example';

/** O exemplo do Masked Input mostra o erro certo ao sair do campo. */
describe('exemplo do Masked Input', () => {
  async function setup() {
    const fixture = TestBed.createComponent(MaskedInputClientExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const input = (n: number) => root.querySelectorAll('input')[n];
    const fill = async (n: number, text: string) => {
      input(n).value = text;
      input(n).dispatchEvent(new Event('input'));
      input(n).dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    const errors = () =>
      Array.from(root.querySelectorAll('[role="alert"], .arg-field__error'))
        .map((el) => el.textContent?.trim())
        .filter(Boolean);
    return { root, input, fill, errors, fixture };
  }

  it('erro de obrigatório, incompleto e inválido; some quando o valor é válido', async () => {
    const { fill, errors } = await setup();

    await fill(0, '');
    expect(errors()).toContain('Preencha o CPF.');

    await fill(0, '123');
    expect(errors()).toContain('CPF incompleto.');

    await fill(0, '12345678900');
    expect(errors()).toContain('CPF inválido: confira os números.');

    await fill(0, '52998224725');
    expect(errors().some((text) => text?.includes('CPF'))).toBe(false);
  });

  it('o valor do formulário fica sem máscara', async () => {
    const { root, fill } = await setup();
    await fill(1, '12abc34501de35');
    await fill(3, '11912345678');
    const shown = root.querySelector('code')?.textContent ?? '';
    expect(shown).toContain('"cnpj": "12ABC34501DE35"');
    expect(shown).toContain('"phone": "11912345678"');
  });
});
