import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { ArgIcon } from '../icon/icon';
import type { ArgIconName } from '../icon/icons.generated';
import { injectUniqueId } from '../internal/unique-id';

export type ArgEmptyStateLevel = 2 | 3 | 4 | 5 | 6;

/**
 * Tela sem dados: ícone, título, texto e ação, sobre `<section>` ou `<div>`.
 *
 * ```html
 * <section arg-empty-state heading="Nenhum pedido ainda" icon="plus">
 *   Os pedidos feitos no balcão e no site aparecem aqui.
 *   <button arg-button arg-empty-state-action>Novo pedido</button>
 * </section>
 * ```
 *
 * Registre o ícone com `provideArgIcons`, como em qualquer `arg-icon`.
 */
@Component({
  selector: 'section[arg-empty-state], div[arg-empty-state]',
  imports: [ArgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  host: {
    class: 'arg-empty-state',
    '[class.arg-empty-state--bordered]': 'bordered()',
    // Só a <section> ganha nome: num <div> genérico, aria-labelledby não vale
    '[attr.aria-labelledby]': 'isSection ? headingId : null',
  },
})
export class ArgEmptyState {
  /** O que falta, em poucas palavras: "Nenhum pedido ainda". */
  readonly heading = input.required<string>();
  /** Nível do título (`<h2>` a `<h6>`), para seguir a hierarquia da página. */
  readonly level = input<ArgEmptyStateLevel, unknown>(2, {
    transform: (value) => numberAttribute(value, 2) as ArgEmptyStateLevel,
  });
  /** Ícone decorativo acima do título. Registre-o com `provideArgIcons`. */
  readonly icon = input<ArgIconName>();
  /** Borda tracejada, para marcar o lugar do conteúdo que ainda não existe. */
  readonly bordered = input(false, { transform: booleanAttribute });

  protected readonly headingId = injectUniqueId('arg-empty-state-heading');
  protected readonly isSection =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'SECTION';
}
