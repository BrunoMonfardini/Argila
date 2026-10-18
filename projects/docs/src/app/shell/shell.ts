import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ArgButton, ArgTheme } from '@brunomonfardini/ui';
import { pagesIn } from '../availability';
import { DOC_MANIFEST, manifestPage } from '../manifest';
import { DOC_PAGES } from '../registry';
import { buildNavigation } from './navigation';
import { DocNavRail } from './nav-rail';
import { DocThemeBar } from './theme-bar';

/** Layout do catálogo: cabeçalho com tema, barra de ícones com painel e conteúdo. */
@Component({
  selector: 'doc-shell',
  imports: [ArgButton, DocNavRail, DocThemeBar, RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class DocShell {
  private readonly pages = inject(DOC_PAGES);
  private readonly manifest = inject(DOC_MANIFEST);
  private readonly theme = inject(ArgTheme);
  /** Só as páginas do design system escolhido: as que estão fora dele somem. */
  protected readonly sections = computed(() =>
    buildNavigation(
      pagesIn(this.theme.style(), this.pages, (page) => manifestPage(this.manifest, page)),
    ),
  );
  /** Gaveta da navegação aberta no celular; no desktop a barra de ícones fica sempre visível. */
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
