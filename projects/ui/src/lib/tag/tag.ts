import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ArgIcon } from '../icon/icon';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconCheck, argIconX } from '../icon/icons.generated';
import { injectUniqueId } from '../internal/unique-id';

/**
 * Item de uma seleção ou filtro, opcionalmente removível:
 *
 * ```html
 * <arg-tag removable (removed)="remover('gatos')">Gatos</arg-tag>
 * ```
 *
 * O botão de remover é focável, aciona com Enter, Espaço, Delete ou
 * Backspace, e o leitor de tela lê "Remover Gatos".
 *
 * Como chip de filtro, `selectable` vira o texto num botão de alternância
 * (`aria-pressed`), com `[(selected)]`:
 *
 * ```html
 * <arg-tag selectable [(selected)]="soVacinados">Vacinados</arg-tag>
 * ```
 */
@Component({
  selector: 'arg-tag',
  imports: [ArgIcon, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tag.html',
  styleUrls: ['./tag.css', '../internal/sr-only.css'],
  host: {
    class: 'arg-tag',
    '[class.arg-tag--removable]': 'removable()',
    '[class.arg-tag--selectable]': 'selectable()',
    '[class.arg-tag--selected]': 'selectable() && selected()',
    '[class.arg-tag--disabled]': 'disabled()',
  },
})
export class ArgTag {
  /** Mostra o botão de remover. */
  readonly removable = input(false, { transform: booleanAttribute });
  /** Verbo do botão de remover, lido antes do texto da tag: "Remover", "Tirar filtro". */
  readonly removeText = input('Remover');
  /** Disparado quando a pessoa remove a tag; quem usa tira o item da lista. */
  readonly removed = output();
  /** Chip de filtro: o texto vira um botão que liga e desliga (`aria-pressed`). */
  readonly selectable = input(false, { transform: booleanAttribute });
  /** Com `selectable`: o chip está ligado. Use `[(selected)]`. */
  readonly selected = model(false);
  /** Desabilita o chip selecionável e o botão de remover. */
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly textId = injectUniqueId('arg-tag-text');
  protected readonly removeTextId = injectUniqueId('arg-tag-remove');

  constructor() {
    // O ícone é do próprio componente: o produto não precisa registrá-lo.
    inject(ArgIconRegistry).register([argIconX, argIconCheck]);
  }

  protected toggle(): void {
    if (!this.disabled()) this.selected.update((on) => !on);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if ((event.key === 'Delete' || event.key === 'Backspace') && !this.disabled()) {
      event.preventDefault();
      this.removed.emit();
    }
  }
}
