import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_FIELD } from '../field/field';
import { ArgCurrencyInput, formatCents, parseCents } from './currency-input';

/** Formatação do Intl com espaço comum no lugar do não separável, para comparar. */
const plain = (text: string) => text.replace(/\s/g, ' ');

describe('formatCents e parseCents', () => {
  it('formata centavos em reais', () => {
    expect(plain(formatCents(0))).toBe('R$ 0,00');
    expect(plain(formatCents(5))).toBe('R$ 0,05');
    expect(plain(formatCents(123456))).toBe('R$ 1.234,56');
    expect(formatCents(null)).toBe('');
  });

  it('lê só os dígitos, ignorando o resto', () => {
    expect(parseCents('R$ 1.234,56')).toBe(123456);
    expect(parseCents('12a3')).toBe(123);
    expect(parseCents('R$ 0,00')).toBe(0);
    expect(parseCents('')).toBeNull();
    expect(parseCents('abc')).toBeNull();
  });

  it('limita a 13 dígitos, para continuar um inteiro seguro', () => {
    expect(parseCents('9'.repeat(20))).toBe(9_999_999_999_999);
  });
});

@Component({
  imports: [ArgCurrencyInput, ARG_FIELD, ReactiveFormsModule, FormField],
  template: `
    <arg-field label="Valor do banho">
      <input arg-currency id="reativo" [formControl]="price" />
    </arg-field>
    <arg-field label="Gorjeta">
      <input arg-currency id="sinais" [formField]="tip.amount" />
    </arg-field>
  `,
})
class Host {
  readonly price = new FormControl<number | null>(8990);
  readonly tipModel = signal({ amount: null as number | null });
  readonly tip = form(this.tipModel);
}

describe('ArgCurrencyInput', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const type = async (input: HTMLInputElement, text: string) => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      type,
      reactive: root.querySelector<HTMLInputElement>('#reativo')!,
      signals: root.querySelector<HTMLInputElement>('#sinais')!,
    };
  }

  it('é um input de texto com teclado numérico, ligado ao rótulo do campo', async () => {
    const { reactive } = await setup();
    expect(reactive.type).toBe('text');
    expect(reactive.getAttribute('inputmode')).toBe('numeric');
    expect(reactive.placeholder).toBe('R$ 0,00');
    expect(accessibleName(reactive)).toBe('Valor do banho');
  });

  it('mostra o valor inicial do formulário formatado', async () => {
    const { reactive } = await setup();
    expect(plain(reactive.value)).toBe('R$ 89,90');
  });

  it('os dígitos entram pela direita e o formulário recebe centavos', async () => {
    const { host, reactive, type } = await setup();

    await type(reactive, '1');
    expect(plain(reactive.value)).toBe('R$ 0,01');
    await type(reactive, `${reactive.value}2`);
    await type(reactive, `${reactive.value}3`);
    await type(reactive, `${reactive.value}4`);
    await type(reactive, `${reactive.value}5`);

    expect(plain(reactive.value)).toBe('R$ 123,45');
    expect(host.price.value).toBe(12345);
    expect(reactive.selectionStart).toBe(reactive.value.length);
  });

  it('apagar tira o último dígito; apagar tudo deixa null', async () => {
    const { host, reactive, type } = await setup();
    await type(reactive, 'R$ 89,9');
    expect(plain(reactive.value)).toBe('R$ 8,99');
    expect(host.price.value).toBe(899);

    await type(reactive, '');
    expect(reactive.value).toBe('');
    expect(host.price.value).toBeNull();
  });

  it('colar um valor formatado funciona; letras são ignoradas', async () => {
    const { host, reactive, type } = await setup();
    await type(reactive, 'R$ 1.250,00');
    expect(host.price.value).toBe(125000);
    await type(reactive, '12abc');
    expect(host.price.value).toBe(12);
  });

  it('Reactive Forms: setValue, disable e touched', async () => {
    const { fixture, host, reactive } = await setup();

    host.price.setValue(150000);
    await fixture.whenStable();
    expect(plain(reactive.value)).toBe('R$ 1.500,00');

    host.price.disable();
    await fixture.whenStable();
    expect(reactive.disabled).toBe(true);

    host.price.enable();
    reactive.dispatchEvent(new Event('blur'));
    expect(host.price.touched).toBe(true);
  });

  it('formulários de signals: o modelo recebe centavos e o campo fica tocado', async () => {
    const { fixture, host, signals, type } = await setup();
    expect(signals.value).toBe('');

    await type(signals, '500');
    expect(host.tipModel().amount).toBe(500);
    expect(plain(signals.value)).toBe('R$ 5,00');

    signals.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.tip.amount().touched()).toBe(true);

    host.tipModel.set({ amount: 2000 });
    await fixture.whenStable();
    expect(plain(signals.value)).toBe('R$ 20,00');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
