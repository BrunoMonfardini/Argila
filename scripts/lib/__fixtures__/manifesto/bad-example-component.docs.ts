import type { DocPage } from '../../../../projects/ui/src/docs/doc-page';

// Inválido de propósito: o exemplo não tem component.
export const BAD: DocPage = {
  slug: 'x',
  title: 'X',
  category: 'Componentes',
  summary: '',
  examples: [{ name: 'Sem componente' }],
};
