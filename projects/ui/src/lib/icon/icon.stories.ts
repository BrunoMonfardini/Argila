import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { ArgButton } from '../button/button';
import { ArgIcon } from './icon';
import { provideArgIcons } from './icon-registry';
import { argIconsAll } from './icons.generated';

const meta: Meta<ArgIcon> = {
  title: 'Componentes/Icon',
  component: ArgIcon,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideArgIcons(argIconsAll)] })],
  argTypes: {
    name: { control: 'select', options: argIconsAll.map((icon) => icon.name) },
    size: { control: 'inline-radio', options: [undefined, 'sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: { name: 'plus', size: 'lg' },
};

export default meta;
type Story = StoryObj<ArgIcon>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: var(--arg-space-4); align-items: center">
        <arg-icon name="check" size="sm" />
        <arg-icon name="check" size="md" />
        <arg-icon name="check" size="lg" />
      </div>
    `,
  }),
};

/** Ao lado do texto, decorativo: o botão já dá o espaçamento. */
export const InButton: Story = {
  render: () => ({
    moduleMetadata: { imports: [ArgButton] },
    template: `<button arg-button><arg-icon name="plus" /> Novo agendamento</button>`,
  }),
};
