import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type ArgSkeletonShape = 'text' | 'rect' | 'circle';

/**
 * Espaço reservado com brilho (shimmer) enquanto o conteúdo carrega:
 *
 * ```html
 * <div role="group" aria-busy="true" aria-label="Carregando perfil">
 *   <arg-skeleton shape="circle" width="3rem" />
 *   <arg-skeleton width="60%" />
 * </div>
 * ```
 *
 * É sempre decorativo (`aria-hidden`): anuncie o carregamento no contêiner.
 */
@Component({
  selector: 'arg-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './skeleton.css',
  host: {
    class: 'arg-skeleton',
    '[class]': '`arg-skeleton--${shape()}`',
    '[class.arg-skeleton--static]': '!animated()',
    'aria-hidden': 'true',
    '[style.width]': 'width()',
    '[style.height]': 'resolvedHeight()',
  },
})
export class ArgSkeleton {
  /** `text` imita uma linha de texto; `rect` para imagens e cards; `circle` para avatares. */
  readonly shape = input<ArgSkeletonShape>('text');
  /** Qualquer valor CSS de largura, ex.: '60%', '12rem'. */
  readonly width = input<string>();
  /** Qualquer valor CSS de altura. Em `circle`, o padrão é a largura. */
  readonly height = input<string>();
  /** Brilho animado. Desligue em listas longas ou quando o movimento distrai. */
  readonly animated = input(true, { transform: booleanAttribute });

  protected readonly resolvedHeight = computed(
    () => this.height() ?? (this.shape() === 'circle' ? this.width() : undefined),
  );
}
