import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  contentChild,
  input,
} from '@angular/core';

/**
 * Linha clicável dentro de um `arg-list-item`. Mantém a semântica nativa de
 * link ou botão e ocupa a linha inteira:
 *
 * ```html
 * <li arg-list-item>
 *   <a arg-list-action routerLink="/pedidos/42">
 *     <span arg-list-title>Pedido #42</span>
 *   </a>
 * </li>
 * ```
 */
@Component({
  selector: 'a[arg-list-action], button[arg-list-action]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-item.html',
  host: { class: 'arg-list__action' },
})
export class ArgListAction {}

/**
 * Item de lista com áreas opcionais marcadas por atributo:
 * `arg-list-leading` (ícone, avatar), `arg-list-title`, `arg-list-description`
 * e `arg-list-trailing` (valor, badge, ação secundária).
 */
@Component({
  selector: 'li[arg-list-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-item.html',
  host: {
    class: 'arg-list__item',
    '[class.arg-list__item--interactive]': '!!action()',
  },
})
export class ArgListItem {
  protected readonly action = contentChild(ArgListAction);
}

/**
 * Lista do Argila sobre `<ul>`/`<ol>` nativos:
 *
 * ```html
 * <ul arg-list divided>
 *   <li arg-list-item>
 *     <img arg-list-leading src="avatar.png" alt="" />
 *     <span arg-list-title>Maria Souza</span>
 *     <span arg-list-description>maria@exemplo.com</span>
 *     <span arg-list-trailing>Admin</span>
 *   </li>
 * </ul>
 * ```
 *
 * Os estilos não são encapsulados porque título, descrição e ícones são
 * conteúdo projetado; todos os seletores ficam sob `.arg-list`.
 */
@Component({
  selector: 'ul[arg-list], ol[arg-list]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './list.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'arg-list',
    '[class.arg-list--divided]': 'divided()',
    '[class.arg-list--bordered]': 'bordered()',
  },
})
export class ArgList {
  /** Linha separadora entre os itens. */
  readonly divided = input(false, { transform: booleanAttribute });
  /** Contêiner com borda e fundo de superfície, para listas soltas na página. */
  readonly bordered = input(false, { transform: booleanAttribute });
}

/** Tudo o que uma lista usa, para importar de uma vez: `imports: [ARG_LIST]`. */
export const ARG_LIST = [ArgList, ArgListItem, ArgListAction] as const;
