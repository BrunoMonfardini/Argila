import type { DocPage } from '../../../../projects/ui/src/docs/doc-page';

const examples: DocPage['examples'] = [];

export const BAD: DocPage = {
  slug: 'x',
  title: 'X',
  category: 'Componentes',
  summary: '',
  examples,
};
