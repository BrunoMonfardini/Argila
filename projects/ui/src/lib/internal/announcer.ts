import { DOCUMENT, DestroyRef, Injectable, inject } from '@angular/core';

export type ArgAnnouncePoliteness = 'polite' | 'assertive';

/**
 * Esconde da tela e mantém no leitor de tela. Inline porque as regiões
 * ficam no <body>, fora de qualquer componente com estilo.
 */
const VISUALLY_HIDDEN =
  'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;' +
  'clip-path:inset(50%);white-space:nowrap;border:0';

/**
 * Tempo entre limpar e escrever a mensagem: os leitores de tela só anunciam
 * uma mudança, então a mesma mensagem duas vezes precisa desse intervalo.
 */
const ANNOUNCE_DELAY_MS = 100;

/**
 * Anuncia mensagens para leitores de tela sem mover o foco, por regiões
 * `aria-live` criadas uma vez no `<body>`:
 *
 * ```ts
 * private readonly announcer = inject(ArgAnnouncer);
 * this.announcer.announce('Agendamento salvo');
 * this.announcer.announce('Horário indisponível', 'assertive');
 * ```
 *
 * Use `assertive` só para o que interrompe a tarefa (erros); o resto é `polite`.
 */
@Injectable({ providedIn: 'root' })
export class ArgAnnouncer {
  private readonly document = inject(DOCUMENT);
  private readonly regions = new Map<ArgAnnouncePoliteness, HTMLElement>();
  private readonly timers = new Map<ArgAnnouncePoliteness, ReturnType<typeof setTimeout>>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.timers.forEach((timer) => clearTimeout(timer));
      this.regions.forEach((region) => region.remove());
    });
  }

  announce(message: string, politeness: ArgAnnouncePoliteness = 'polite'): void {
    const region = this.region(politeness);
    clearTimeout(this.timers.get(politeness));
    region.textContent = '';
    this.timers.set(
      politeness,
      setTimeout(() => {
        region.textContent = message;
      }, ANNOUNCE_DELAY_MS),
    );
  }

  /** Limpa as mensagens, ex.: ao sair da tela que as gerou. */
  clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.regions.forEach((region) => (region.textContent = ''));
  }

  private region(politeness: ArgAnnouncePoliteness): HTMLElement {
    let region = this.regions.get(politeness);
    if (!region) {
      region = this.document.createElement('div');
      region.setAttribute('aria-live', politeness);
      region.setAttribute('aria-atomic', 'true');
      region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
      region.setAttribute('style', VISUALLY_HIDDEN);
      region.className = 'arg-announcer';
      this.document.body.append(region);
      this.regions.set(politeness, region);
    }
    return region;
  }
}
