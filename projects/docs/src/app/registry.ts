import { InjectionToken } from '@angular/core';
import { BUTTON_DOCS } from '../../../ui/src/lib/button/button.docs';
import { DIVIDER_DOCS } from '../../../ui/src/lib/divider/divider.docs';
import { ICON_DOCS } from '../../../ui/src/lib/icon/icon.docs';
import { ICON_BUTTON_DOCS } from '../../../ui/src/lib/icon-button/icon-button.docs';
import { LINK_DOCS } from '../../../ui/src/lib/link/link.docs';
import { LIST_DOCS } from '../../../ui/src/lib/list/list.docs';
import { SKELETON_DOCS } from '../../../ui/src/lib/skeleton/skeleton.docs';
import { SPINNER_DOCS } from '../../../ui/src/lib/spinner/spinner.docs';
import { LIST_LOADING_DOCS } from '../../../ui/src/patterns/loading.docs';
import type { DocCategory, DocPage } from '../../../ui/src/docs/doc-page';

export type { DocCategory, DocExample, DocPage } from '../../../ui/src/docs/doc-page';

/**
 * Todas as páginas do catálogo. Componente novo: crie o `<componente>.docs.ts`
 * e acrescente aqui. O CI confere que nenhum componente exportado ficou de fora.
 */
export const ALL_DOC_PAGES: readonly DocPage[] = [
  BUTTON_DOCS,
  DIVIDER_DOCS,
  ICON_DOCS,
  ICON_BUTTON_DOCS,
  LINK_DOCS,
  LIST_DOCS,
  SKELETON_DOCS,
  SPINNER_DOCS,
  LIST_LOADING_DOCS,
];

export const DOC_PAGES = new InjectionToken<readonly DocPage[]>('DOC_PAGES', {
  providedIn: 'root',
  factory: () => ALL_DOC_PAGES,
});

const CATEGORY_PATHS: Record<DocCategory, string> = {
  Fundamentos: 'fundamentos',
  Componentes: 'componentes',
  Padrões: 'padroes',
};

/** Segmento da URL de cada categoria: "Padrões" → "padroes". */
export function categoryPath(category: DocCategory): string {
  return CATEGORY_PATHS[category];
}

/** Caminho da página no catálogo: /componentes/button. */
export function pagePath(page: DocPage): string {
  return `/${categoryPath(page.category)}/${page.slug}`;
}

export function findPage(
  pages: readonly DocPage[],
  category: string,
  slug: string,
): DocPage | undefined {
  return pages.find((page) => categoryPath(page.category) === category && page.slug === slug);
}
