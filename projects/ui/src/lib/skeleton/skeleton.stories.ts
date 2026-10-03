import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ArgSkeleton } from './skeleton';

const meta: Meta<ArgSkeleton> = {
  title: 'Componentes/Skeleton',
  component: ArgSkeleton,
  tags: ['autodocs'],
  argTypes: {
    shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    shape: 'text',
    width: '16rem',
  },
  render: (args) => ({
    props: args,
    template: `<arg-skeleton [shape]="shape" [width]="width" [height]="height" />`,
  }),
};

export default meta;
type Story = StoryObj<ArgSkeleton>;

export const Default: Story = {};

export const Shapes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--arg-space-6); align-items: center">
        <arg-skeleton shape="circle" width="3rem" />
        <arg-skeleton shape="rect" width="10rem" height="6rem" />
        <arg-skeleton width="10rem" />
      </div>
    `,
  }),
};

/** Parágrafo: varie as larguras e deixe a última linha mais curta. */
export const Paragraph: Story = {
  render: () => ({
    template: `
      <div role="group" aria-busy="true" aria-label="Carregando descrição" style="max-width: 28rem">
        <arg-skeleton />
        <arg-skeleton width="92%" />
        <arg-skeleton width="60%" />
      </div>
    `,
  }),
};

/** Card de produto: imagem, título, preço e ação. */
export const Card: Story = {
  render: () => ({
    template: `
      <div role="group" aria-busy="true" aria-label="Carregando produto"
        style="width: 16rem; padding: var(--arg-space-4); display: grid; gap: var(--arg-space-3);
        background: var(--arg-color-surface); border: 1px solid var(--arg-color-border);
        border-radius: var(--arg-radius-container)">
        <arg-skeleton shape="rect" height="10rem" />
        <div>
          <arg-skeleton width="80%" />
          <arg-skeleton width="40%" />
        </div>
        <arg-skeleton shape="rect" height="2.5rem" style="--arg-skeleton-radius: var(--arg-radius-control)" />
      </div>
    `,
  }),
};
