import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { injectUniqueId } from '../../../../internal/unique-id';

export type ArgXpWindowControl = 'minimize' | 'maximize' | 'close';

const CONTROL_LABELS: Record<ArgXpWindowControl, string> = {
  minimize: 'Minimizar',
  maximize: 'Maximizar',
  close: 'Fechar',
};

/**
 * Janela do Windows XP: barra de título azul com os botões de minimizar,
 * maximizar e fechar, e o conteúdo embaixo, como no "Retro-OS UI Kit".
 * Exclusivo do Windows XP.
 *
 * ```html
 * <section arg-xp-window title="Confirmação" [controls]="['close']" (closed)="fechar()">
 *   <p>Deseja continuar?</p>
 * </section>
 * ```
 *
 * Os botões são `<button>` nativos com nome ("Fechar Confirmação"); quem usa
 * decide o que cada evento faz.
 */
@Component({
  selector: 'section[arg-xp-window]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="arg-xp-window__bar">
      <span class="arg-xp-window__title" [id]="titleId">{{ title() }}</span>
      @if (controls().length) {
        <span class="arg-xp-window__controls">
          @for (control of controls(); track control) {
            <button
              type="button"
              class="arg-xp-window__control"
              [class]="'arg-xp-window__control--' + control"
              [attr.aria-label]="labels[control] + ' ' + title()"
              (click)="press(control)"
            >
              <span class="arg-xp-window__glyph" aria-hidden="true"></span>
            </button>
          }
        </span>
      }
    </header>
    <div class="arg-xp-window__body"><ng-content /></div>
  `,
  styleUrl: './xp-window.css',
  host: {
    class: 'arg-xp-window',
    '[attr.aria-labelledby]': 'titleId',
  },
})
export class ArgXpWindow {
  /** Título na barra azul, que também nomeia a janela para o leitor de tela. */
  readonly title = input.required<string>();
  /** Botões da barra de título, na ordem: `minimize`, `maximize` e `close`. */
  readonly controls = input<readonly ArgXpWindowControl[]>(['minimize', 'maximize', 'close']);
  /** Botão de minimizar acionado. */
  readonly minimized = output();
  /** Botão de maximizar acionado. */
  readonly maximized = output();
  /** Botão de fechar acionado. */
  readonly closed = output();

  protected readonly titleId = injectUniqueId('arg-xp-window');
  protected readonly labels = CONTROL_LABELS;

  protected press(control: ArgXpWindowControl): void {
    if (control === 'minimize') this.minimized.emit();
    else if (control === 'maximize') this.maximized.emit();
    else this.closed.emit();
  }
}
