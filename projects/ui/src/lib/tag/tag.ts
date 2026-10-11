import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { ArgIcon } from '../icon/icon';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconX } from '../icon/icons.generated';
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
 */
@Component({
  selector: 'arg-tag',
  imports: [ArgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tag.html',
  styleUrl: './tag.css',
  host: {
    class: 'arg-tag',
    '[class.arg-tag--removable]': 'removable()',
  },
})
export class ArgTag {
  /** Mostra o botão de remover. */
  readonly removable = input(false, { transform: booleanAttribute });
  /** Verbo do botão de remover, lido antes do texto da tag: "Remover", "Tirar filtro". */
  readonly removeText = input('Remover');
  /** Disparado quando a pessoa remove a tag; quem usa tira o item da lista. */
  readonly removed = output();

  protected readonly textId = injectUniqueId('arg-tag-text');
  protected readonly removeTextId = injectUniqueId('arg-tag-remove');

  constructor() {
    // O ícone é do próprio componente: o produto não precisa registrá-lo.
    inject(ArgIconRegistry).register([argIconX]);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.removed.emit();
    }
  }
}
