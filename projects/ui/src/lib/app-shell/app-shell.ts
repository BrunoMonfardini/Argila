import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconMenu } from '../icon/icons.generated';
import { ArgIconButton } from '../icon-button/icon-button';
import { injectUniqueId } from '../internal/unique-id';

/**
 * Estrutura da aplicação: cabeçalho com a marca do tenant, menu lateral e
 * área principal, sobre `<header>`, `<nav>` e `<main>`.
 *
 * ```html
 * <arg-app-shell brandName="Clínica Patas" [brandLogo]="tenant.logo">
 *   <div arg-app-shell-actions><arg-avatar [name]="usuario.nome" /></div>
 *   <nav arg-app-shell-nav aria-label="Principal">…</nav>
 *   <router-outlet />
 * </arg-app-shell>
 * ```
 *
 * Com menos de `compactBelow` px de largura, o menu lateral sai da tela e
 * vira uma gaveta aberta pelo botão de menu do cabeçalho. A cor do cabeçalho
 * vem da marca aplicada com `ArgTheme.setBrand`.
 */
@Component({
  selector: 'arg-app-shell',
  imports: [ArgIconButton, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
  host: {
    class: 'arg-app-shell',
    '[class.arg-app-shell--compact]': 'compact()',
    '(click)': 'onNavClick($event)',
  },
})
export class ArgAppShell {
  /** Nome do tenant no cabeçalho: "Clínica Patas". */
  readonly brandName = input.required<string>();
  /** Logo do tenant, ao lado do nome. É decorativo: o nome já está escrito. */
  readonly brandLogo = input<string | null>(null);
  /** Link da marca, normalmente a página inicial. Sem ele, a marca é só texto. */
  readonly brandHref = input<string | null>(null);
  /** Largura, em px, abaixo da qual o menu lateral vira gaveta. */
  readonly compactBelow = input(768);
  /** Nome do botão que abre o menu no modo compacto. */
  readonly menuText = input('Abrir menu');
  /** Texto do link "pular para o conteúdo", o primeiro do Tab. */
  readonly skipText = input('Pular para o conteúdo');

  protected readonly navId = injectUniqueId('arg-app-shell-nav');
  protected readonly mainId = injectUniqueId('arg-app-shell-main');
  private readonly width = signal(Number.POSITIVE_INFINITY);
  /** Se o shell está no modo compacto (menu lateral como gaveta). */
  readonly compact = computed(() => this.width() < this.compactBelow());
  /** Se a gaveta do menu está aberta (só no modo compacto). */
  readonly navOpen = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private readonly nav = viewChild.required<ElementRef<HTMLElement>>('nav');
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');
  /** Navegador sem a API de popover: a gaveta é mostrada e escondida por código. */
  private readonly nativePopover = typeof this.host.showPopover === 'function';

  /** Sem a API de popover, controla a visibilidade da gaveta direto no estilo. */
  protected readonly fallbackDisplay = computed(() =>
    this.compact() && !this.nativePopover ? (this.navOpen() ? 'block' : 'none') : null,
  );

  constructor() {
    inject(ArgIconRegistry).register([argIconMenu]);
    const destroyRef = inject(DestroyRef);

    // Só no navegador: mede a largura do próprio shell, não da janela
    afterNextRender(() => {
      const view = this.host.ownerDocument.defaultView;
      if (!view?.ResizeObserver) return;
      const observer = new view.ResizeObserver(([entry]) => {
        this.width.set(entry.contentRect.width);
        if (!this.compact()) this.navOpen.set(false);
      });
      observer.observe(this.host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** Abre a gaveta do menu (modo compacto). */
  openNav(): void {
    if (!this.compact() || this.navOpen()) return;
    if (this.nativePopover) this.nav().nativeElement.showPopover();
    else this.setNavOpen(true);
  }

  /** Fecha a gaveta do menu. */
  closeNav(): void {
    if (!this.navOpen()) return;
    if (this.nativePopover) this.nav().nativeElement.hidePopover();
    else this.setNavOpen(false);
  }

  protected onMenuClick(): void {
    // Com a API nativa, o popovertarget do botão já abre e fecha
    if (!this.nativePopover) this.setNavOpen(!this.navOpen());
  }

  protected onNavToggle(event: Event): void {
    this.setNavOpen((event as ToggleEvent).newState === 'open');
  }

  /** No modo compacto, escolher um link do menu fecha a gaveta. */
  protected onNavClick(event: MouseEvent): void {
    const target = event.target as Element;
    if (!this.compact() || !this.nav().nativeElement.contains(target)) return;
    if (target.closest('a[href]')) this.closeNav();
  }

  /** Move o foco para o conteúdo sem mudar a URL (o `<base href>` faria `#id` navegar). */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }

  private setNavOpen(open: boolean): void {
    if (this.navOpen() === open) return;
    this.navOpen.set(open);
    if (!open) return;
    // Gaveta aberta: o foco vai para o primeiro link ou botão do menu, já visível
    afterNextRender(
      () =>
        this.nav()
          .nativeElement.querySelector<HTMLElement>('a[href], button:not([disabled])')
          ?.focus(),
      { injector: this.injector },
    );
  }
}
