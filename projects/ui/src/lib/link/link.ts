import { ChangeDetectionStrategy, Component, booleanAttribute, inject, input } from '@angular/core';
import { ArgIcon } from '../icon/icon';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconExternalLink } from '../icon/icons.generated';

export type ArgLinkVariant = 'default' | 'muted';

/**
 * Link de texto, sempre sublinhado (a cor sozinha não basta para indicar um
 * link). Aplicado sobre o `<a>` nativo, funciona com `href` e `routerLink`:
 *
 * ```html
 * <a arg-link routerLink="/ajuda">Ajuda</a>
 * <a arg-link external href="https://exemplo.com">Ver documentação</a>
 * ```
 */
@Component({
  selector: 'a[arg-link]',
  imports: [ArgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />
    @if (external()) {
      <arg-icon class="arg-link__icon" name="external-link" /><span class="arg-link__hint">
        {{ externalHint() }}</span
      >
    }`,
  styleUrl: './link.css',
  host: {
    class: 'arg-link',
    '[class.arg-link--muted]': 'variant() === "muted"',
    '[attr.target]': 'external() ? "_blank" : null',
    '[attr.rel]': 'external() ? "noopener noreferrer" : null',
  },
})
export class ArgLink {
  /** `default` na cor de link; `muted` na cor do texto secundário, para rodapés e metadados. */
  readonly variant = input<ArgLinkVariant>('default');
  /** Abre em outra aba: mostra o ícone e avisa o leitor de tela. */
  readonly external = input(false, { transform: booleanAttribute });
  /** Aviso lido pelo leitor de tela em links externos, depois do texto do link. */
  readonly externalHint = input('(abre em nova aba)');

  constructor() {
    // O ícone é do próprio componente: o produto não precisa registrá-lo.
    inject(ArgIconRegistry).register([argIconExternalLink]);
  }
}
