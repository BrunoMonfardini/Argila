import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArgTheme } from '@brunomonfardini/ui';
import { pagesIn } from '../../availability';
import { DocCode } from '../../code/code';
import { DOC_MANIFEST, manifestPage } from '../../manifest';
import { DOC_PAGES } from '../../registry';
import { DocText } from '../../shared/text';
import { buildNavigation, sectionLinks } from '../../shell/navigation';

/** Página inicial: o que é o Argila e um índice de tudo o que o catálogo tem. */
@Component({
  selector: 'doc-home-page',
  imports: [DocCode, DocText, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  protected readonly install = 'pnpm add @brunomonfardini/ui';
  /** As mesmas seções da navegação, sem o "Começo", que é esta página. */
  private readonly pages = inject(DOC_PAGES);
  private readonly manifest = inject(DOC_MANIFEST);
  private readonly theme = inject(ArgTheme);
  protected readonly sections = computed(() =>
    buildNavigation(
      pagesIn(this.theme.style(), this.pages, (page) => manifestPage(this.manifest, page)),
    )
      .filter((section) => section.id !== 'comeco')
      .map((section) => ({ id: section.id, title: section.title, links: sectionLinks(section) })),
  );
}
