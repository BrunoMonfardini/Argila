import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  viewChild,
} from '@angular/core';
import { ArgIconRegistry } from './icon-registry';
import type { ArgIconName } from './icons.generated';

export type ArgIconSize = 'sm' | 'md' | 'lg';

/**
 * Ícone desenhado pelo time, na cor do texto ao redor:
 *
 * ```html
 * <button arg-button><arg-icon name="plus" /> Novo agendamento</button>
 * <arg-icon name="alert-triangle" label="Atenção" />
 * ```
 *
 * Registre os ícones usados com `provideArgIcons`. Sem `label`, o ícone é
 * decorativo e fica oculto para leitores de tela.
 */
@Component({
  selector: 'arg-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
    aria-hidden="true"
    #svg
  ></svg>`,
  styleUrl: './icon.css',
  host: {
    class: 'arg-icon',
    '[class]': 'size() ? `arg-icon--${size()}` : ""',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
})
export class ArgIcon {
  /** Nome do ícone, pela forma: `plus`, `trash`, `arrow-left`. */
  readonly name = input.required<ArgIconName>();
  /** Tamanho por token. Sem tamanho, acompanha o texto ao redor (1.25em). */
  readonly size = input<ArgIconSize>();
  /** Nome acessível, só quando o ícone tem significado sozinho. */
  readonly label = input<string>();

  private readonly registry = inject(ArgIconRegistry);
  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly drawing = computed(() => this.registry.get(this.name()));

  constructor() {
    // O desenho vem só das constantes geradas a partir dos SVGs validados do
    // repositório; por isso pode ir direto para o DOM, sem sanitizador.
    effect(() => {
      this.svg().nativeElement.innerHTML = this.drawing() ?? '';
    });
    effect(() => {
      if (isDevMode() && this.drawing() === undefined) {
        console.error(
          `[arg-icon] O ícone "${this.name()}" não foi registrado. ` +
            'Inclua a constante dele em provideArgIcons([...]).',
        );
      }
    });
  }
}
