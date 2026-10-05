import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOC_MANIFEST, manifestPage } from '../../manifest';
import { DOC_PAGES, findPage } from '../../registry';
import { DocText } from '../../shared/text';
import { DocExampleFrame } from './example-frame';
import { DocPropsTable } from './props-table';

/** Página de um componente ou padrão, montada a partir do `DocPage`. */
@Component({
  selector: 'doc-component-page',
  imports: [DocExampleFrame, DocPropsTable, DocText, RouterLink],
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
  private readonly manifest = inject(DOC_MANIFEST);

  protected readonly page = computed(() => findPage(this.pages, this.categoria(), this.slug()));
  /** O que o manifesto leu do código: propriedades, tokens e o código dos exemplos. */
  protected readonly generated = computed(() => {
    const page = this.page();
    return page ? manifestPage(this.manifest, page) : undefined;
  });
}
