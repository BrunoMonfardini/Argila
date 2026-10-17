import { Component, signal } from '@angular/core';
import { ArgField } from '../../field/field';
import { ArgIconButton } from '../../icon-button/icon-button';
import { ARG_INPUT_GROUP, ArgInput } from '../input';

/** Campo com o botão de ação encostado no fim: digite um serviço e adicione. */
@Component({
  selector: 'doc-input-action-example',
  imports: [ArgField, ArgInput, ArgIconButton, ARG_INPUT_GROUP],
  template: `
    <arg-field label="Adicionar serviço">
      <arg-input-group>
        <input arg-input [value]="servico()" (input)="servico.set($any($event.target).value)" />
        <button
          arg-icon-button
          argInputAction
          variant="secondary"
          icon="plus"
          label="Adicionar"
          (click)="adicionar()"
        ></button>
      </arg-input-group>
    </arg-field>
    <p>Serviços: {{ servicos().join(', ') || 'nenhum' }}</p>
  `,
})
export class InputActionExample {
  readonly servico = signal('');
  readonly servicos = signal<string[]>(['Banho']);

  adicionar(): void {
    const novo = this.servico().trim();
    if (novo) this.servicos.update((lista) => [...lista, novo]);
    this.servico.set('');
  }
}
