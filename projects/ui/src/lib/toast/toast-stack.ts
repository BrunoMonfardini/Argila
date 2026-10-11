import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ArgButton } from '../button/button';
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

export type ArgToastTone = 'info' | 'success' | 'warning' | 'danger';

/** Um aviso na tela. Interno: quem usa o design system chama `ArgToast.show()`. */
export interface ArgToastItem {
  id: number;
  message: string;
  title?: string;
  tone: ArgToastTone;
  actionLabel?: string;
}

const ICONS: Record<ArgToastTone, ArgIconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

/**
 * Pilha de avisos no canto da tela, criada pelo `ArgToast` no `<body>` como
 * `popover="manual"` (camada de topo). Interna.
 *
 * Não é região `aria-live`: o anúncio sai pelo `ArgAnnouncer`, que já está na
 * página antes da mensagem e por isso é lido de forma confiável.
 */
@Component({
  selector: 'arg-toast-stack',
  imports: [ArgButton, ArgIcon, ArgIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toast.css',
  host: {
    popover: 'manual',
    role: 'region',
    'aria-label': 'Notificações',
    class: 'arg-toast-stack',
    '(mouseenter)': 'hovered.set(true); pauseChange()',
    '(mouseleave)': 'hovered.set(false); pauseChange()',
    '(focusin)': 'focused.set(true); pauseChange()',
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    @for (toast of toasts(); track toast.id) {
      <div class="arg-toast" [class]="'arg-toast--' + toast.tone">
        <arg-icon class="arg-toast__icon" [name]="icons[toast.tone]" />
        <div class="arg-toast__body">
          @if (toast.title) {
            <p class="arg-toast__title">{{ toast.title }}</p>
          }
          <p class="arg-toast__message">{{ toast.message }}</p>
        </div>
        @if (toast.actionLabel) {
          <button arg-button variant="tertiary" size="sm" (click)="act(toast.id)">
            {{ toast.actionLabel }}
          </button>
        }
        <button
          arg-icon-button
          icon="x"
          size="sm"
          label="Fechar notificação"
          (click)="dismiss(toast.id)"
        ></button>
      </div>
    }
  `,
})
export class ArgToastStack {
  readonly toasts = signal<readonly ArgToastItem[]>([]);
  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  protected readonly icons = ICONS;

  /** Ligados pelo serviço. */
  onAction: (id: number) => void = () => undefined;
  onDismiss: (id: number) => void = () => undefined;
  onPause: (paused: boolean) => void = () => undefined;

  constructor() {
    inject(ArgIconRegistry).register([
      argIconInfo,
      argIconCheckCircle,
      argIconAlertTriangle,
      argIconAlertCircle,
      argIconX,
    ]);
  }

  protected act(id: number): void {
    this.onAction(id);
  }

  protected dismiss(id: number): void {
    this.onDismiss(id);
  }

  protected pauseChange(): void {
    this.onPause(this.hovered() || this.focused());
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && (event.currentTarget as HTMLElement).contains(next)) return;
    this.focused.set(false);
    this.pauseChange();
  }
}
