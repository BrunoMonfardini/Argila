import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ArgButton } from '@brunomonfardini/ui';
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
  protected readonly sections = buildNavigation(inject(DOC_PAGES));
  /** Gaveta da navegação aberta no celular; no desktop a barra de ícones fica sempre visível. */
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
