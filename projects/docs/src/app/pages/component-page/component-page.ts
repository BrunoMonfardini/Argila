import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOC_PAGES, findPage } from '../../registry';
import { DocText } from '../../shared/text';
import { DocExampleFrame } from './example-frame';

/** Página de um componente ou padrão, montada a partir do `DocPage`. */
@Component({
  selector: 'doc-component-page',
  imports: [DocExampleFrame, DocText, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-page.html',
  styleUrl: './component-page.css',
})
export class ComponentPage {
  /** Segmento da categoria na URL, vindo da rota. */
  readonly categoria = input.required<string>();
  /** Slug da página na URL, vindo da rota. */
  readonly slug = input.required<string>();

  private readonly pages = inject(DOC_PAGES);

  protected readonly page = computed(() => findPage(this.pages, this.categoria(), this.slug()));
}
