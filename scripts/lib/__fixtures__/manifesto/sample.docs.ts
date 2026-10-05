import type { DocPage } from '../../../../projects/ui/src/docs/doc-page';
import { SampleBasicExample } from './examples/sample-basic.example';
import { ArgNoStyle, ArgSample } from './sample';

export const SAMPLE_DOCS: DocPage = {
  slug: 'sample',
  title: 'Sample',
  category: 'Componentes',
  summary: 'Amostra.',
  component: ArgSample,
  examples: [{ name: 'Básico', component: SampleBasicExample }],
};

export const NO_STYLE_DOCS: DocPage = {
  slug: 'no-style',
  title: 'Sem estilo',
  category: 'Componentes',
  summary: 'Sem CSS.',
  component: ArgNoStyle,
  examples: [],
};

export const PATTERN_DOCS: DocPage = {
  slug: 'padrao',
  title: 'Padrão',
  category: 'Padrões',
  summary: 'Sem componente.',
  examples: [{ name: 'Uso', component: SampleBasicExample }],
};

export const NOT_A_PAGE = { slug: 'ignorado' };
