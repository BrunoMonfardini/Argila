import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ARG_FIELD } from '../../field/field';
import { ArgCurrencyInput } from '../currency-input';

/** Digite só números: eles entram pela direita. O formulário guarda centavos. */
@Component({
  selector: 'doc-currency-input-price-example',
  imports: [ARG_FIELD, ArgCurrencyInput, ReactiveFormsModule],
  template: `
    <div class="doc-stack">
      <arg-field label="Preço do banho" hint="Digite os números, sem vírgula.">
        <input arg-currency [formControl]="price" />
      </arg-field>
      <p class="doc-said">
        Valor no formulário: <code>{{ value() ?? 'null' }}</code> (centavos)
      </p>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-2);
      max-width: 20rem;
    }
    .doc-said {
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class CurrencyInputPriceExample {
  protected readonly price = new FormControl<number | null>(8990);
  protected readonly value = toSignal(this.price.valueChanges, { initialValue: this.price.value });
}
