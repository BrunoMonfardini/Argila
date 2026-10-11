import { Component, computed, signal } from '@angular/core';
import { ARG_CHOICE } from '../choice';

/** "Todos" fica indeterminado quando só parte dos itens está marcada. */
@Component({
  selector: 'doc-choice-checkbox-example',
  imports: [ARG_CHOICE],
  template: `
    <arg-choice-group label="Serviços do atendimento">
      <label arg-choice>
        <input
          type="checkbox"
          arg-checkbox
          [checked]="allChecked()"
          [indeterminate]="someChecked()"
          (change)="toggleAll()"
        />
        Todos
      </label>
      @for (service of services; track service) {
        <label arg-choice class="doc-nested">
          <input
            type="checkbox"
            arg-checkbox
            [checked]="selected().has(service)"
            (change)="toggle(service)"
          />
          {{ service }}
        </label>
      }
    </arg-choice-group>
  `,
  styles: `
    .doc-nested {
      margin-inline-start: var(--arg-space-6);
    }
  `,
})
export class ChoiceCheckboxExample {
  protected readonly services = ['Banho', 'Tosa', 'Corte de unhas'];
  protected readonly selected = signal(new Set(['Banho']));
  protected readonly allChecked = computed(() => this.selected().size === this.services.length);
  protected readonly someChecked = computed(() => this.selected().size > 0 && !this.allChecked());

  protected toggle(service: string): void {
    this.selected.update((current) => {
      const next = new Set(current);
      if (next.has(service)) {
        next.delete(service);
      } else {
        next.add(service);
      }
      return next;
    });
  }

  protected toggleAll(): void {
    this.selected.set(this.allChecked() ? new Set() : new Set(this.services));
  }
}
