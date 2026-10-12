import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * Um item da trilha. Use um link (`<a arg-link variant="muted">`) para as
 * páginas acima e só o texto, com `current`, para a página atual.
 */
@Component({
  selector: 'li[arg-breadcrumb-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './breadcrumb-item.css',
  host: {
    class: 'arg-breadcrumb__item',
    '[class.arg-breadcrumb__item--current]': 'current()',
    '[attr.aria-current]': 'current() ? "page" : null',
  },
})
export class ArgBreadcrumbItem {
  /** Página atual: recebe `aria-current="page"` e fica em destaque. Use no último item. */
  readonly current = input(false, { transform: booleanAttribute });
}

/**
 * Trilha de navegação ("breadcrumb") sobre `<nav>` e uma lista ordenada:
 * mostra onde a página está e leva às páginas acima dela.
 *
 * ```html
 * <nav arg-breadcrumb>
 *   <li arg-breadcrumb-item><a arg-link variant="muted" routerLink="/clientes">Clientes</a></li>
 *   <li arg-breadcrumb-item><a arg-link variant="muted" routerLink="/clientes/42">Maria Souza</a></li>
 *   <li arg-breadcrumb-item current>Thor</li>
 * </nav>
 * ```
 */
@Component({
  selector: 'nav[arg-breadcrumb]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ol class="arg-breadcrumb__list"><ng-content /></ol>',
  styleUrl: './breadcrumb.css',
  host: {
    class: 'arg-breadcrumb',
    '[attr.aria-label]': 'label()',
  },
})
export class ArgBreadcrumb {
  /** Nome da região de navegação, lido pelo leitor de tela. */
  readonly label = input('Trilha de navegação');
}

/** Tudo o que a trilha usa, para importar de uma vez: `imports: [ARG_BREADCRUMB]`. */
export const ARG_BREADCRUMB = [ArgBreadcrumb, ArgBreadcrumbItem] as const;
