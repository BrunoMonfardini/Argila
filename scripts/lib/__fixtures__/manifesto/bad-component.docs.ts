import type { DocPage } from '../../../../projects/ui/src/docs/doc-page';

const notAClass = 'texto';

export const BAD: DocPage = {
  slug: 'x',
  title: 'X',
  category: 'Componentes',
  summary: '',
  component: notAClass as unknown as DocPage['component'],
  examples: [],
};
