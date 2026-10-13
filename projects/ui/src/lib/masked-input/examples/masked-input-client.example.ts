import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ARG_FIELD } from '../../field/field';
import { ArgMaskedInput } from '../masked-input';

type FieldName = 'cpf' | 'cnpj' | 'cep' | 'phone';

const LABELS: Record<FieldName, string> = {
  cpf: 'CPF',
  cnpj: 'CNPJ',
  cep: 'CEP',
  phone: 'Telefone',
};

/**
 * Cadastro com os quatro tipos. Os erros aparecem ao sair do campo. Teste o
 * CPF 529.982.247-25 e o CNPJ alfanumérico 12.ABC.345/01DE-35.
 */
@Component({
  selector: 'doc-masked-input-client-example',
  imports: [ARG_FIELD, ArgMaskedInput, JsonPipe, ReactiveFormsModule],
  template: `
    <form class="doc-grid" [formGroup]="form">
      <arg-field label="CPF" [error]="error('cpf')">
        <input arg-mask="cpf" formControlName="cpf" />
      </arg-field>
      <arg-field label="CNPJ" hint="Aceita o CNPJ com letras." [error]="error('cnpj')">
        <input arg-mask="cnpj" formControlName="cnpj" />
      </arg-field>
      <arg-field label="CEP" [error]="error('cep')">
        <input arg-mask="cep" formControlName="cep" />
      </arg-field>
      <arg-field label="Telefone" hint="Fixo ou celular, com DDD." [error]="error('phone')">
        <input arg-mask="phone" formControlName="phone" />
      </arg-field>
    </form>
    <p class="doc-said">
      Valor do formulário: <code>{{ value() | json }}</code>
    </p>
  `,
  styles: `
    .doc-grid {
      display: grid;
      flex: 1 1 100%;
      grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
      gap: var(--arg-space-4);
    }
    .doc-said {
      flex: 1 1 100%;
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class MaskedInputClientExample {
  protected readonly form = new FormGroup({
    cpf: new FormControl('', Validators.required),
    cnpj: new FormControl(''),
    cep: new FormControl(''),
    phone: new FormControl(''),
  });
  protected readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  // Qualquer mudança de valor, estado ou "tocado" recalcula as mensagens
  private readonly events = toSignal(this.form.events);

  protected error(name: FieldName): string | null {
    this.events();
    const control = this.form.controls[name];
    if (!control.touched || !control.errors) return null;
    const label = LABELS[name];
    if (control.errors['required']) return `Preencha o ${label}.`;
    if (control.errors['incomplete']) return `${label} incompleto.`;
    return `${label} inválido: confira os números.`;
  }
}
