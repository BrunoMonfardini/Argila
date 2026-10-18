import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IsActiveMatchOptions,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { ARG_LIST, ArgIcon, ArgInput } from '@brunomonfardini/ui';
import { filter, map } from 'rxjs';
import { DocNavSection, filterNavigation, sectionOf } from './navigation';

/**
 * Navegação do catálogo: uma barra de ícones, com o rótulo embaixo, e um
 * painel com as páginas da seção escolhida e a busca no topo. O painel fica
 * aberto até a pessoa seguir um link, apertar Esc ou clicar fora.
 */
@Component({
  selector: 'doc-nav-rail',
  imports: [ARG_LIST, ArgIcon, ArgInput, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-rail.html',
  styleUrl: './nav-rail.css',
  host: {
    '(document:click)': 'clickOutside($event)',
    '(keydown.escape)': 'escape()',
  },
})
export class DocNavRail {
  readonly sections = input.required<DocNavSection[]>();
  /** Avisa quando um link é seguido, para fechar a gaveta no celular. */
  readonly navigate = output();

  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly search = viewChild('search', { read: ElementRef<HTMLInputElement> });
  private readonly triggers = viewChildren<ElementRef<HTMLButtonElement>>('trigger');

  /** Página ativa pelo caminho; o estado do playground na URL não conta. */
  protected readonly activeOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  };
  protected readonly panelId = 'painel-navegacao';
  /** Seção com o painel aberto; `undefined` com ele fechado. */
  protected readonly open = signal<string | undefined>(undefined);
  protected readonly query = signal('');
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  /** Seção da página atual, destacada na barra. */
  protected readonly current = computed(() => sectionOf(this.sections(), this.url()));
  protected readonly openSection = computed(() =>
    this.sections().find((section) => section.id === this.open()),
  );
  /** Com busca, os resultados de todas as seções; sem, só a seção aberta. */
  protected readonly visible = computed(() => {
    const query = this.query().trim();
    if (query) return filterNavigation(this.sections(), query);
    const section = this.openSection();
    return section ? [section] : [];
  });

  protected toggle(id: string): void {
    if (this.open() === id) {
      this.close();
      return;
    }
    this.open.set(id);
    this.query.set('');
    // O foco vai para a busca, primeiro item do painel; Esc devolve ao botão
    afterNextRender(() => this.search()?.nativeElement.focus(), { injector: this.injector });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected follow(): void {
    this.close();
    this.navigate.emit();
  }

  protected escape(): void {
    const id = this.open();
    if (!id) return;
    this.close();
    const index = this.sections().findIndex((section) => section.id === id);
    this.triggers()[index]?.nativeElement.focus();
  }

  protected clickOutside(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  private close(): void {
    this.open.set(undefined);
    this.query.set('');
  }
}
