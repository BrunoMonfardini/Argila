import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ArgButton } from '@brunomonfardini/ui';
import { buildNavigation } from './navigation';
import { DocSidebar } from './sidebar';
import { DocThemeBar } from './theme-bar';

/** Layout do catálogo: cabeçalho com tema, barra lateral e conteúdo. */
@Component({
  selector: 'doc-shell',
  imports: [ArgButton, DocSidebar, DocThemeBar, RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class DocShell {
  protected readonly sections = buildNavigation();
  /** Menu lateral aberto no celular; no desktop ele fica sempre visível. */
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
