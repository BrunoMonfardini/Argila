import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ArgButton } from './button';

const meta: Meta<ArgButton & { label: string }> = {
  title: 'Componentes/Button',
  component: ArgButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    label: 'Salvar',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <button arg-button [variant]="variant" [size]="size" [disabled]="disabled"
        [loading]="loading" [fullWidth]="fullWidth">{{ label }}</button>
    `,
  }),
};

export default meta;
type Story = StoryObj<ArgButton & { label: string }>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--arg-space-3); flex-wrap: wrap">
        <button arg-button variant="primary">Primário</button>
        <button arg-button variant="secondary">Secundário</button>
        <button arg-button variant="tertiary">Terciário</button>
        <button arg-button variant="danger">Excluir</button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--arg-space-3); align-items: center">
        <button arg-button size="sm">Pequeno</button>
        <button arg-button size="md">Médio</button>
        <button arg-button size="lg">Grande</button>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--arg-space-3); flex-wrap: wrap">
        <button arg-button disabled>Desabilitado</button>
        <button arg-button variant="secondary" disabled>Desabilitado</button>
        <button arg-button loading>Salvando</button>
        <a arg-button variant="tertiary" href="#">Link com cara de botão</a>
      </div>
    `,
  }),
};
