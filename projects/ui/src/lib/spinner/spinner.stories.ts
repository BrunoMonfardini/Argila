import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ArgSpinner } from './spinner';

const meta: Meta<ArgSpinner> = {
  title: 'Componentes/Spinner',
  component: ArgSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    size: 'md',
    label: 'Carregando',
    decorative: false,
  },
  render: (args) => ({
    props: args,
    template: `<arg-spinner [size]="size" [label]="label" [decorative]="decorative" />`,
  }),
};

export default meta;
type Story = StoryObj<ArgSpinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--arg-space-6); align-items: center">
        <arg-spinner size="sm" label="Carregando (pequeno)" />
        <arg-spinner size="md" label="Carregando (médio)" />
        <arg-spinner size="lg" label="Carregando (grande)" />
      </div>
    `,
  }),
};

/** Página ou seção inteira carregando: centralize e diga o que está vindo. */
export const Section: Story = {
  render: () => ({
    template: `
      <div style="display: grid; place-items: center; gap: var(--arg-space-3);
        min-height: 12rem; color: var(--arg-color-text-muted)">
        <arg-spinner size="lg" label="Carregando pedidos" />
        <span aria-hidden="true">Carregando pedidos…</span>
      </div>
    `,
  }),
};

/** Herda a cor do texto ao redor pelo token de componente. */
export const CurrentColor: Story = {
  render: () => ({
    template: `
      <p style="display: flex; gap: var(--arg-space-2); align-items: center;
        color: var(--arg-color-text-muted)">
        <arg-spinner size="sm" decorative style="--arg-spinner-color: currentColor" />
        Sincronizando…
      </p>
    `,
  }),
};
