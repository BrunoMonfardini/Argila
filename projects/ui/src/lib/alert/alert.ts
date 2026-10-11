import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { ArgIcon } from '../icon/icon';
import { ArgIconRegistry } from '../icon/icon-registry';
import {
  argIconAlertCircle,
  argIconAlertTriangle,
  argIconCheckCircle,
  argIconInfo,
  argIconX,
  type ArgIconName,
} from '../icon/icons.generated';
import { ArgIconButton } from '../icon-button/icon-button';

export type ArgAlertTone = 'info' | 'success' | 'warning' | 'danger';

/**
 * Como o leitor de tela anuncia o alerta. `polite` (`role="status"`) espera
 * a fala atual terminar; `assertive` (`role="alert"`) interrompe; `off` não
 * anuncia, para avisos que já estão na página quando ela abre.
 */
export type ArgAlertLive = 'polite' | 'assertive' | 'off';

const TONES: Record<ArgAlertTone, { icon: ArgIconName; label: string; live: ArgAlertLive }> = {
  info: { icon: 'info', label: 'Informação', live: 'polite' },
  success: { icon: 'check-circle', label: 'Sucesso', live: 'polite' },
  warning: { icon: 'alert-triangle', label: 'Atenção', live: 'assertive' },
  danger: { icon: 'alert-circle', label: 'Erro', live: 'assertive' },
};

/**
 * Mensagem de feedback com ícone, sobre um `<div>`:
 *
 * ```html
 * <div arg-alert tone="success" heading="Agendamento confirmado">
 *   Thor tem banho na sexta, às 14h.
 * </div>
 * ```
 *
 * O `role` vem do tom: `status` para info e sucesso, `alert` para aviso e
 * erro. O tom também é lido antes do texto ("Erro: …"), porque a cor e o
 * ícone não chegam ao leitor de tela.
 */
@Component({
  selector: 'div[arg-alert]',
  imports: [ArgIcon, ArgIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.html',
  styleUrls: ['./alert.css', '../internal/sr-only.css'],
  host: {
    '[class]': '"arg-alert arg-alert--" + tone()',
    '[attr.role]': 'role()',
  },
})
export class ArgAlert {
  /** Cor, ícone e `role`: `info`, `success`, `warning` ou `danger`. */
  readonly tone = input<ArgAlertTone>('info');
  /** Título curto, em negrito, antes do texto. */
  readonly heading = input<string>();
  /** Troca o anúncio padrão do tom; veja `ArgAlertLive`. */
  readonly live = input<ArgAlertLive>();
  /** Nome do tom lido antes do texto; o padrão vem do tom ("Erro", "Atenção"…). */
  readonly toneLabel = input<string>();
  /** Mostra o botão de fechar. Quem usa o alerta o tira da página no `(dismissed)`. */
  readonly dismissible = input(false, { transform: booleanAttribute });
  /** Nome do botão de fechar, lido pelo leitor de tela. */
  readonly dismissText = input('Fechar aviso');
  /** Clique no botão de fechar. */
  readonly dismissed = output();

  protected readonly icon = computed(() => TONES[this.tone()].icon);
  protected readonly label = computed(() => this.toneLabel() ?? TONES[this.tone()].label);
  protected readonly role = computed(() => {
    const live = this.live() ?? TONES[this.tone()].live;
    return live === 'off' ? null : live === 'assertive' ? 'alert' : 'status';
  });

  constructor() {
    inject(ArgIconRegistry).register([
      argIconInfo,
      argIconCheckCircle,
      argIconAlertTriangle,
      argIconAlertCircle,
      argIconX,
    ]);
  }
}
