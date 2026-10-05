import type { Preview } from '@storybook/angular-vite';

import '../tokens/argila.css';
import '../tokens/base.css';
import '../tokens/themes/example-brand.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Modo de cor',
      toolbar: {
        title: 'Tema',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Escuro' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Marca do produto/tenant',
      toolbar: {
        title: 'Marca',
        icon: 'paintbrush',
        items: [
          { value: 'argila', title: 'Argila (padrão)' },
          { value: 'example', title: 'Exemplo' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    brand: 'argila',
  },
  decorators: [
    (story, context) => {
      const root = document.documentElement;
      root.setAttribute('data-arg-theme', context.globals['theme']);
      root.setAttribute('data-arg-brand', context.globals['brand']);
      return story();
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Introdução', 'Fundamentos', 'Componentes', 'Padrões'],
      },
    },
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'error' faz o teste de acessibilidade falhar nas stories
      test: 'error',
    },
  },
};

export default preview;
