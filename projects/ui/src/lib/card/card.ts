import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  contentChild,
  input,
} from '@angular/core';

export type ArgCardVariant = 'outlined' | 'elevated';

/**
 * Link ou botão principal do card. Fica no título, para o nome acessível ser
 * curto, e torna o card inteiro clicável. Os outros botões e links do card
 * continuam com foco e clique próprios:
 *
 * ```html
 * <article arg-card>
 *   <h3 arg-card-title><a arg-card-link routerLink="/pets/thor">Thor</a></h3>
 *   <p arg-card-description>Golden retriever, 4 anos</p>
 *   <footer arg-card-actions><button arg-button variant="secondary">Agendar</button></footer>
 * </article>
 * ```
 */
@Component({
  selector: 'a[arg-card-link], button[arg-card-link]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: { class: 'arg-card__link' },
})
export class ArgCardLink {}

/**
 * Card do Argila sobre `<article>` ou `<section>` (também `<div>` e `<li>`),
 * com áreas opcionais marcadas por atributo: `arg-card-media` (imagem de
 * borda a borda, no topo), `arg-card-header`, `arg-card-title`,
 * `arg-card-description`, `arg-card-content` e `arg-card-actions`.
 *
 * Os estilos não são encapsulados porque as áreas são conteúdo projetado;
 * todos os seletores ficam sob `.arg-card`.
 */
@Component({
  selector: 'article[arg-card], section[arg-card], div[arg-card], li[arg-card]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'arg-card',
    '[class.arg-card--elevated]': "variant() === 'elevated'",
    '[class.arg-card--interactive]': '!!link()',
  },
})
export class ArgCard {
  /** `outlined` tem borda; `elevated` tem sombra, para destacar do fundo. */
  readonly variant = input<ArgCardVariant>('outlined');

  protected readonly link = contentChild(ArgCardLink, { descendants: true });
}

/** Tudo o que um card usa, para importar de uma vez: `imports: [ARG_CARD]`. */
export const ARG_CARD = [ArgCard, ArgCardLink] as const;
