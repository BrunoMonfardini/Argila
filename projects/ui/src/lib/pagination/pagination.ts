import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { ArgAnnouncer } from '../internal/announcer';

/** Um número de página, ou `'gap'` para as reticências entre números distantes. */
export type ArgPageItem = number | 'gap';

/**
 * Quais páginas mostrar: sempre a primeira e a última, a atual e `siblings`
 * vizinhas de cada lado; o resto vira reticências. Uma reticência nunca
 * esconde uma página só (aí a página aparece no lugar dela).
 */
export function pageItems(page: number, total: number, siblings = 1): ArgPageItem[] {
  if (total <= 0) return [];
  const start = Math.max(2, page - siblings);
  const end = Math.min(total - 1, page + siblings);
  const items: ArgPageItem[] = [1];
  if (start === 3) items.push(2);
  else if (start > 3) items.push('gap');
  for (let n = start; n <= end; n++) items.push(n);
  if (end === total - 2) items.push(total - 1);
  else if (end < total - 2) items.push('gap');
  if (total > 1) items.push(total);
  return items;
}

/**
 * Navegação entre páginas de uma lista, sobre `<nav>`:
 *
 * ```html
 * <nav arg-pagination [total]="totalDePaginas()" [(page)]="pagina"></nav>
 * ```
 *
 * A página atual tem `aria-current="page"` e, ao trocar, "Página 3 de 12" é
 * anunciado pelo leitor de tela. Anterior e Próxima ficam com
 * `aria-disabled` nas pontas, sem perder o foco.
 */
@Component({
  selector: 'nav[arg-pagination]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  host: {
    class: 'arg-pagination',
    '[attr.aria-label]': 'label()',
  },
})
export class ArgPagination {
  /** Quantidade de páginas. */
  readonly total = input.required<number>();
  /** Página atual, começando em 1. */
  readonly page = model(1);
  /** Quantas páginas vizinhas da atual aparecem de cada lado. */
  readonly siblings = input(1);
  /** Nome da navegação, lido pelo leitor de tela. */
  readonly label = input('Paginação');
  /** Texto do botão de voltar uma página. */
  readonly previousText = input('Anterior');
  /** Texto do botão de avançar uma página. */
  readonly nextText = input('Próxima');

  private readonly announcer = inject(ArgAnnouncer);

  protected readonly current = computed(() => Math.min(Math.max(this.page(), 1), this.total()));
  protected readonly items = computed(() =>
    pageItems(this.current(), this.total(), this.siblings()),
  );
  protected readonly status = computed(() => `Página ${this.current()} de ${this.total()}`);
  protected readonly isFirst = computed(() => this.current() <= 1);
  protected readonly isLast = computed(() => this.current() >= this.total());

  protected go(page: number): void {
    const target = Math.min(Math.max(page, 1), this.total());
    if (target === this.current()) return;
    this.page.set(target);
    this.announcer.announce(this.status());
  }
}
