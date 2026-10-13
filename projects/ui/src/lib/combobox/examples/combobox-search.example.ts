import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ARG_FIELD } from '../../field/field';
import { ArgCombobox, ArgComboboxOption, ArgComboboxSearch, filterOptions } from '../combobox';

const SERVICES: ArgComboboxOption[] = [
  { value: 'banho', label: 'Banho' },
  { value: 'tosa', label: 'Tosa higiênica' },
  { value: 'tosa-completa', label: 'Tosa completa' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'vacina', label: 'Vacina antirrábica' },
  { value: 'hidratacao', label: 'Hidratação de pelos' },
];

const TUTORS: ArgComboboxOption[] = [
  { value: 't1', label: 'Maria Souza', description: 'Tutora de Thor e Mel' },
  { value: 't2', label: 'João Pereira', description: 'Tutor de Pipoca' },
  { value: 't3', label: 'Mariana Lima', description: 'Tutora de Bob' },
  { value: 't4', label: 'Márcio Alves', description: 'Tutor de Luna' },
  { value: 't5', label: 'Ana Beatriz Costa', description: 'Tutora de Nina' },
];

/** Busca de exemplo, com 600 ms de espera, como se fosse no servidor. */
const searchTutors: ArgComboboxSearch = (term) =>
  new Promise((resolve) => setTimeout(() => resolve(filterOptions(TUTORS, term)), 600));

/**
 * Lista local (serviços) e busca no servidor (tutores, a partir de 2 letras).
 * Teclado: ↓ ↑ andam, Enter escolhe, Esc fecha e, fechado, limpa.
 */
@Component({
  selector: 'doc-combobox-search-example',
  imports: [ARG_FIELD, ArgCombobox, ReactiveFormsModule],
  template: `
    <div class="doc-grid">
      <arg-field label="Serviço">
        <input arg-combobox [options]="services" [formControl]="service" />
      </arg-field>
      <arg-field label="Tutor" hint="Digite ao menos 2 letras.">
        <input arg-combobox [search]="search" [minChars]="2" [formControl]="tutor" />
      </arg-field>
    </div>
    <p class="doc-said">
      Valores: serviço <code>{{ serviceValue() ?? 'null' }}</code
      >, tutor
      <code>{{ tutorValue() ?? 'null' }}</code>
    </p>
  `,
  styles: `
    .doc-grid {
      display: grid;
      flex: 1 1 100%;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: var(--arg-space-4);
    }
    .doc-said {
      flex: 1 1 100%;
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class ComboboxSearchExample {
  protected readonly services = SERVICES;
  protected readonly search = searchTutors;
  protected readonly service = new FormControl<string | null>(null);
  protected readonly tutor = new FormControl<string | null>(null);
  protected readonly serviceValue = toSignal(this.service.valueChanges, { initialValue: null });
  protected readonly tutorValue = toSignal(this.tutor.valueChanges, { initialValue: null });
}
