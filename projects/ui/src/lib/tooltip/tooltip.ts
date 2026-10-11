import {
  ApplicationRef,
  ComponentRef,
  DOCUMENT,
  Directive,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  afterNextRender,
  createComponent,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { placeBeside, supportsAnchor } from '../internal/place-beside';
import { injectUniqueId } from '../internal/unique-id';
import { ArgTooltipPanel, ArgTooltipPosition } from './tooltip-panel';

export type { ArgTooltipPosition } from './tooltip-panel';

/** Espera antes de abrir no hover, para não piscar quando o mouse só passa por cima. */
const HOVER_OPEN_DELAY = 300;
/** Espera antes de fechar, para dar tempo de levar o mouse até o balão. */
const CLOSE_DELAY = 100;

/**
 * Texto curto que aparece ao lado de um elemento no foco e no hover, e
 * fecha com Esc:
 *
 * ```html
 * <button arg-button argTooltip="Atalho: Ctrl + S">Salvar</button>
 * <button arg-icon-button icon="x" label="Fechar" argTooltip="Fechar"></button>
 * ```
 *
 * O texto vira descrição do gatilho (`aria-describedby`). Quando é igual
 * ao nome do gatilho, como num botão de ícone, não é repetido.
 */
@Directive({
  selector: '[argTooltip]',
  host: {
    '(mouseenter)': 'scheduleOpen()',
    '(mouseleave)': 'scheduleClose()',
    '(focusin)': 'openNow()',
    '(focusout)': 'closeNow()',
    '[style.anchor-name]': 'anchorName',
  },
})
export class ArgTooltip implements OnDestroy {
  /** Texto do tooltip: curto, sem links nem botões. */
  readonly argTooltip = input.required<string>();
  /** Lado do gatilho; se faltar espaço, o navegador usa o lado oposto. */
  readonly argTooltipPosition = input<ArgTooltipPosition>('top');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  private readonly id = injectUniqueId('arg-tooltip');
  protected readonly anchorName = `--${this.id}`;
  private readonly panel = signal<ComponentRef<ArgTooltipPanel> | null>(null);
  private readonly isOpen = signal(false);
  private openTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Só no navegador: o balão fica no <body>, fora do componente que o usa
    afterNextRender(() => this.createPanel());

    effect(() => {
      const panel = this.panel();
      if (!panel) return;
      panel.setInput('text', this.argTooltip());
      panel.setInput('position', this.argTooltipPosition());
      this.updateDescription(this.argTooltip());
    });
  }

  protected scheduleOpen(): void {
    clearTimeout(this.closeTimer);
    if (this.isOpen()) return;
    clearTimeout(this.openTimer);
    this.openTimer = setTimeout(() => this.show(), HOVER_OPEN_DELAY);
  }

  protected scheduleClose(): void {
    clearTimeout(this.openTimer);
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.hide(), CLOSE_DELAY);
  }

  protected openNow(): void {
    clearTimeout(this.openTimer);
    clearTimeout(this.closeTimer);
    this.show();
  }

  protected closeNow(): void {
    clearTimeout(this.openTimer);
    clearTimeout(this.closeTimer);
    this.hide();
  }

  ngOnDestroy(): void {
    this.closeNow();
    const panel = this.panel();
    if (!panel) return;
    this.updateDescription(null);
    this.appRef.detachView(panel.hostView);
    panel.destroy();
  }

  private createPanel(): void {
    const panel = createComponent(ArgTooltipPanel, { environmentInjector: this.injector });
    panel.setInput('id', this.id);
    panel.setInput('anchor', this.anchorName);
    const element: HTMLElement = panel.location.nativeElement;
    // Levar o mouse do gatilho para o balão não fecha (WCAG 1.4.13)
    element.addEventListener('mouseenter', () => clearTimeout(this.closeTimer));
    element.addEventListener('mouseleave', () => this.scheduleClose());
    this.appRef.attachView(panel.hostView);
    this.document.body.appendChild(element);
    this.panel.set(panel);
  }

  private show(): void {
    const element = this.panel()?.location.nativeElement as HTMLElement | undefined;
    if (!element || this.isOpen()) return;
    element.showPopover?.();
    element.classList.add('arg-tooltip--open');
    this.isOpen.set(true);
    // Navegadores sem anchor CSS: posiciona por JS
    if (!supportsAnchor(this.document.defaultView)) {
      placeBeside(this.host, element, this.argTooltipPosition());
    }
    this.document.addEventListener('keydown', this.onKeydown, true);
  }

  private hide(): void {
    const element = this.panel()?.location.nativeElement as HTMLElement | undefined;
    if (!element || !this.isOpen()) return;
    element.hidePopover?.();
    element.classList.remove('arg-tooltip--open');
    this.isOpen.set(false);
    this.document.removeEventListener('keydown', this.onKeydown, true);
  }

  /** Esc fecha só o tooltip: não chega a um diálogo ou menu que esteja por baixo. */
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.closeNow();
  };

  /** Liga o texto como descrição, a menos que ele só repita o nome do gatilho. */
  private updateDescription(text: string | null): void {
    const ids = (this.host.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((id) => id && id !== this.id);
    const name = this.host.getAttribute('aria-label')?.trim();
    if (text !== null && text.trim() !== name) ids.push(this.id);
    if (ids.length) this.host.setAttribute('aria-describedby', ids.join(' '));
    else this.host.removeAttribute('aria-describedby');
  }
}
