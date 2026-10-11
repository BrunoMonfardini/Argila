import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ArgButton } from '../../button/button';
import { ARG_FIELD } from '../../field/field';
import { ArgInput } from '../../input/input';
import {
  ARG_DIALOG_DATA,
  ArgDialog,
  ArgDialogDescription,
  ArgDialogRef,
  ArgDialogTitle,
} from '../dialog';

interface Pet {
  name: string;
}

/** Componente aberto dentro do diálogo: recebe o pet e devolve o novo nome. */
@Component({
  selector: 'doc-edit-pet-dialog',
  imports: [
    ArgButton,
    ARG_FIELD,
    ArgDialogDescription,
    ArgDialogTitle,
    ArgInput,
    ReactiveFormsModule,
  ],
  template: `
    <h2 argDialogTitle>Editar pet</h2>
    <p argDialogDescription>O nome aparece na agenda e nos lembretes.</p>
    <form id="editar-pet" arg-dialog-content (submit)="save($event)">
      <arg-field label="Nome">
        <input arg-input [formControl]="name" arg-dialog-focus />
      </arg-field>
    </form>
    <footer arg-dialog-actions>
      <button arg-button variant="secondary" type="button" (click)="ref.close()">Voltar</button>
      <button arg-button type="submit" form="editar-pet">Salvar</button>
    </footer>
  `,
})
export class EditPetDialog {
  protected readonly ref = inject<ArgDialogRef<string>>(ArgDialogRef);
  private readonly pet = inject(ARG_DIALOG_DATA) as Pet;
  protected readonly name = new FormControl(this.pet.name, { nonNullable: true });

  protected save(event: Event): void {
    event.preventDefault();
    this.ref.close(this.name.value.trim() || this.pet.name);
  }
}

/** Abre com o serviço e espera o resultado. Ao fechar, o foco volta ao botão. */
@Component({
  selector: 'doc-dialog-form-example',
  imports: [ArgButton],
  template: `
    <p class="doc-pet">
      Pet: <strong>{{ pet().name }}</strong>
    </p>
    <button arg-button variant="secondary" (click)="edit()">Editar pet</button>
  `,
  styles: `
    .doc-pet {
      flex: 1 1 100%;
      margin: 0;
    }
  `,
})
export class DialogFormExample {
  private readonly dialog = inject(ArgDialog);
  protected readonly pet = signal<Pet>({ name: 'Thor' });

  protected async edit(): Promise<void> {
    const ref = this.dialog.open<EditPetDialog, Pet, string>(EditPetDialog, { data: this.pet() });
    const name = await ref.closed;
    if (name) this.pet.set({ name });
  }
}
