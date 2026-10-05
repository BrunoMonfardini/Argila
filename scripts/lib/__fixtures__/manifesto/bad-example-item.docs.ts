import type { DocExample, DocPage } from '../../../../projects/ui/src/docs/doc-page';

declare const item: DocExample;

export const BAD: DocPage = {
  slug: 'x',
  title: 'X',
  category: 'Componentes',
  summary: '',
  examples: [item],
};
