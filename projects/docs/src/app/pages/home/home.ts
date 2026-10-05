import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocCode } from '../../code/code';
import { DOC_PAGES } from '../../registry';
import { DocText } from '../../shared/text';
import { buildNavigation } from '../../shell/navigation';

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
  /** As mesmas seções da barra lateral, sem o "Começo", que é esta página. */
  protected readonly sections = buildNavigation(inject(DOC_PAGES)).slice(1);
}
