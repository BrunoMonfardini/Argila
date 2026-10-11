import { ChangeDetectionStrategy, Component, Directive, input } from '@angular/core';
import { ArgPopoverBase, ArgPopoverTriggerBase } from './popover-base';

export type { ArgPopoverPosition } from './popover-base';

/**
 * Painel com conteúdo livre (texto, links, botões, formulário curto) junto de
 * um gatilho. Sobre o `popover="auto"` nativo: clicar fora ou Esc fecham, e o
 * foco volta ao gatilho. Abra com um `<button [argPopoverTrigger]>`:
 *
 * ```html
 * <button arg-button [argPopoverTrigger]="detalhes">Detalhes</button>
 * <arg-popover #detalhes label="Detalhes do pet">…</arg-popover>
 * ```
 */
@Component({
  selector: 'arg-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './popover.css',
  host: {
    role: 'dialog',
    '[attr.aria-label]': 'label()',
    '[class]': '"arg-popover arg-popover--" + position()',
  },
})
export class ArgPopover extends ArgPopoverBase {
  /** Nome do painel para leitores de tela: "Detalhes do pet". */
  readonly label = input.required<string>();
}

/**
 * Gatilho do popover, sobre um `<button>`. Usa o `popovertarget` nativo: o
 * navegador abre e fecha o painel e devolve o foco ao botão.
 */
@Directive({
  selector: 'button[argPopoverTrigger]',
  host: { '[attr.aria-haspopup]': '"dialog"' },
})
export class ArgPopoverTrigger extends ArgPopoverTriggerBase {
  /** O `arg-popover` que este botão abre: `[argPopoverTrigger]="detalhes"`. */
  readonly argPopoverTrigger = input.required<ArgPopover>();

  protected panel(): ArgPopover {
    return this.argPopoverTrigger();
  }
}

/** Tudo o que um popover usa, para importar de uma vez: `imports: [ARG_POPOVER]`. */
export const ARG_POPOVER = [ArgPopover, ArgPopoverTrigger] as const;
