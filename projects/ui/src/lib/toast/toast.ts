import {
  ApplicationRef,
  ComponentRef,
  DOCUMENT,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
} from '@angular/core';
import { ArgAnnouncePoliteness, ArgAnnouncer } from '../internal/announcer';
import { ArgToastItem, ArgToastStack, ArgToastTone } from './toast-stack';

export type { ArgToastTone } from './toast-stack';

/** Por que o aviso saiu: o tempo acabou, a ação foi usada ou a pessoa fechou. */
export type ArgToastReason = 'timeout' | 'action' | 'close';

export interface ArgToastOptions {
  /** Título curto, em negrito, acima da mensagem. */
  title?: string;
  /** Cor, ícone e prioridade do anúncio: `warning` e `danger` interrompem o leitor de tela. */
  tone?: ArgToastTone;
  /**
   * Tempo na tela, em ms. Padrão: 5000, ou 8000 com ação. `0` deixa o aviso
   * até a pessoa fechar. O tempo para com o mouse em cima ou o foco dentro.
   */
  duration?: number;
  /** Botão de ação, ex.: `{ label: 'Desfazer', run: () => restaurar() }`. */
  action?: { label: string; run: () => void };
}

/** Aviso aberto: feche por código ou espere `dismissed`. */
export class ArgToastRef {
  /** Resolve quando o aviso sai da tela, com o motivo. */
  readonly dismissed: Promise<ArgToastReason>;
  private resolve!: (reason: ArgToastReason) => void;

  constructor(private readonly close: (reason: ArgToastReason) => void) {
    this.dismissed = new Promise((resolve) => (this.resolve = resolve));
  }

  /** Tira o aviso da tela (ou da fila). */
  dismiss(): void {
    this.close('close');
  }

  /** @internal */
  settle(reason: ArgToastReason): void {
    this.resolve(reason);
  }
}

interface Entry {
  item: ArgToastItem;
  ref: ArgToastRef;
  action?: () => void;
  /** Tempo que falta, em ms; 0 = sem tempo. */
  remaining: number;
  startedAt: number;
  timer?: ReturnType<typeof setTimeout>;
}

/** Quantos avisos ficam visíveis ao mesmo tempo; os outros esperam na fila. */
const MAX_VISIBLE = 3;
/**
 * Avisos que entram dentro deste tempo são anunciados juntos: o anunciador
 * só lê a última mensagem de um mesmo instante (ele espera 100 ms para escrever).
 */
const JOIN_WINDOW_MS = 150;

/**
 * Avisos curtos e passageiros no canto da tela ("toasts"): "Agendamento
 * salvo", "Lembrete enviado". Ficam numa fila (até 3 visíveis), param de
 * contar o tempo com o mouse em cima ou o foco dentro e são anunciados pelo
 * leitor de tela sem mover o foco.
 *
 * ```ts
 * this.toast.show('Agendamento salvo', { tone: 'success' });
 * this.toast.show('Pet removido', { action: { label: 'Desfazer', run: () => this.restaurar() } });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ArgToast {
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly environment = inject(EnvironmentInjector);
  private readonly announcer = inject(ArgAnnouncer);

  private stack: ComponentRef<ArgToastStack> | null = null;
  private visible: Entry[] = [];
  private queue: Entry[] = [];
  private paused = false;
  private nextId = 1;
  private readonly spoken: Record<ArgAnnouncePoliteness, { text: string; at: number }> = {
    polite: { text: '', at: -Infinity },
    assertive: { text: '', at: -Infinity },
  };

  /** Mostra um aviso, ou o põe na fila se já houver 3 na tela. */
  show(message: string, options: ArgToastOptions = {}): ArgToastRef {
    const id = this.nextId++;
    const ref = new ArgToastRef((reason) => this.remove(id, reason));
    const entry: Entry = {
      item: {
        id,
        message,
        title: options.title,
        tone: options.tone ?? 'info',
        actionLabel: options.action?.label,
      },
      ref,
      action: options.action?.run,
      remaining: options.duration ?? (options.action ? 8000 : 5000),
      startedAt: 0,
    };
    this.queue.push(entry);
    this.flush();
    return ref;
  }

  /** Tira todos os avisos, visíveis e na fila. */
  dismissAll(): void {
    for (const entry of [...this.queue, ...this.visible]) this.remove(entry.item.id, 'close');
  }

  /** Move da fila para a tela enquanto houver espaço. */
  private flush(): void {
    let added = false;
    while (this.visible.length < MAX_VISIBLE && this.queue.length) {
      const entry = this.queue.shift()!;
      this.visible.push(entry);
      const { tone, title, message } = entry.item;
      this.speak(
        title ? `${title}. ${message}` : message,
        tone === 'warning' || tone === 'danger' ? 'assertive' : 'polite',
      );
      if (!this.paused) this.start(entry);
      added = true;
    }
    this.render(added);
  }

  private speak(text: string, politeness: ArgAnnouncePoliteness): void {
    const spoken = this.spoken[politeness];
    const now = Date.now();
    const join = spoken.text && now - spoken.at < JOIN_WINDOW_MS;
    const separator = /[.!?]$/.test(spoken.text) ? ' ' : '. ';
    spoken.text = join ? spoken.text + separator + text : text;
    spoken.at = now;
    this.announcer.announce(spoken.text, politeness);
  }

  private start(entry: Entry): void {
    if (entry.remaining <= 0) return;
    entry.startedAt = Date.now();
    entry.timer = setTimeout(() => this.remove(entry.item.id, 'timeout'), entry.remaining);
  }

  private setPaused(paused: boolean): void {
    if (paused === this.paused) return;
    this.paused = paused;
    for (const entry of this.visible) {
      if (paused && entry.timer !== undefined) {
        clearTimeout(entry.timer);
        entry.timer = undefined;
        entry.remaining = Math.max(entry.remaining - (Date.now() - entry.startedAt), 1);
      } else if (!paused) {
        this.start(entry);
      }
    }
  }

  private remove(id: number, reason: ArgToastReason): void {
    const queued = this.queue.findIndex((entry) => entry.item.id === id);
    if (queued >= 0) {
      this.queue.splice(queued, 1)[0].ref.settle(reason);
      return;
    }
    const index = this.visible.findIndex((entry) => entry.item.id === id);
    if (index < 0) return;
    const [entry] = this.visible.splice(index, 1);
    clearTimeout(entry.timer);
    entry.ref.settle(reason);
    // Sem avisos na tela, nada mais pode estar com o mouse ou o foco em cima
    if (!this.visible.length) this.paused = false;
    this.flush();
  }

  private render(added = false): void {
    const stack = this.ensureStack();
    stack.instance.toasts.set(this.visible.map((entry) => entry.item));
    stack.changeDetectorRef.detectChanges();
    const element: HTMLElement = stack.location.nativeElement;
    const open = this.visible.length > 0;
    if (typeof element.showPopover === 'function') {
      const showing = element.matches(':popover-open');
      // Reabrir põe a pilha de volta no topo, acima de um diálogo aberto depois;
      // não com o foco dentro, que se perderia
      const raise = added && !element.contains(this.document.activeElement);
      if (showing && (!open || raise)) element.hidePopover();
      if (open && (!showing || raise)) element.showPopover();
    } else {
      element.style.display = open ? '' : 'none';
    }
  }

  private ensureStack(): ComponentRef<ArgToastStack> {
    if (this.stack) return this.stack;
    const stack = createComponent(ArgToastStack, { environmentInjector: this.environment });
    stack.instance.onAction = (id) => {
      const entry = this.visible.find((item) => item.item.id === id);
      entry?.action?.();
      this.remove(id, 'action');
    };
    stack.instance.onDismiss = (id) => this.remove(id, 'close');
    stack.instance.onPause = (paused) => this.setPaused(paused);
    this.appRef.attachView(stack.hostView);
    this.document.body.appendChild(stack.location.nativeElement);
    this.stack = stack;
    return stack;
  }
}
