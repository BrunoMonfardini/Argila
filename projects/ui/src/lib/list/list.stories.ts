import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { ARG_LIST, ArgList } from './list';

const people = [
  { initials: 'MS', name: 'Maria Souza', email: 'maria@exemplo.com', role: 'Admin' },
  { initials: 'JP', name: 'João Pereira', email: 'joao@exemplo.com', role: 'Editor' },
  { initials: 'AL', name: 'Ana Lima', email: 'ana@exemplo.com', role: 'Leitor' },
];

const avatar = `
  display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem;
  border-radius: var(--arg-radius-full); background: var(--arg-color-primary-subtle);
  color: var(--arg-color-primary); font-size: var(--arg-font-size-body-sm);
  font-weight: var(--arg-font-weight-strong)
`;

const meta: Meta<ArgList> = {
  title: 'Componentes/List',
  component: ArgList,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ARG_LIST] })],
  args: {
    divided: true,
    bordered: true,
  },
  render: (args) => ({
    props: { ...args, people, avatar },
    template: `
      <ul arg-list [divided]="divided" [bordered]="bordered" style="max-width: 28rem">
        @for (p of people; track p.email) {
          <li arg-list-item>
            <span arg-list-leading [style]="avatar" aria-hidden="true">{{ p.initials }}</span>
            <span arg-list-title>{{ p.name }}</span>
            <span arg-list-description>{{ p.email }}</span>
            <span arg-list-trailing>{{ p.role }}</span>
          </li>
        }
      </ul>
    `,
  }),
};

export default meta;
type Story = StoryObj<ArgList>;

export const Default: Story = {};

/** Só texto, sem contêiner: para listas dentro de cards ou painéis. */
export const Simple: Story = {
  args: { divided: true, bordered: false },
  render: (args) => ({
    props: args,
    template: `
      <ul arg-list [divided]="divided" [bordered]="bordered" style="max-width: 28rem">
        <li arg-list-item><span arg-list-title>Pedidos</span></li>
        <li arg-list-item><span arg-list-title>Clientes</span></li>
        <li arg-list-item><span arg-list-title>Relatórios</span></li>
      </ul>
    `,
  }),
};

/** Linhas navegáveis: cada item contém um link ou botão com `arg-list-action`. */
export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ul arg-list [divided]="divided" [bordered]="bordered" style="max-width: 28rem">
        <li arg-list-item>
          <a arg-list-action href="#pedido-1042">
            <span arg-list-title>Pedido #1042</span>
            <span arg-list-description>3 itens · Maria Souza</span>
            <span arg-list-trailing>R$ 289,90 ›</span>
          </a>
        </li>
        <li arg-list-item>
          <a arg-list-action href="#pedido-1041">
            <span arg-list-title>Pedido #1041</span>
            <span arg-list-description>1 item · João Pereira</span>
            <span arg-list-trailing>R$ 59,00 ›</span>
          </a>
        </li>
        <li arg-list-item>
          <button arg-list-action type="button" disabled>
            <span arg-list-title>Pedido #1040</span>
            <span arg-list-description>Cancelado</span>
          </button>
        </li>
      </ul>
    `,
  }),
};

/** Lista ordenada: a numeração vem do `<ol>` e é lida por leitores de tela. */
export const Ordered: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ol arg-list [divided]="divided" [bordered]="bordered" style="max-width: 28rem">
        <li arg-list-item>
          <span arg-list-leading aria-hidden="true">1</span>
          <span arg-list-title>Escolha os produtos</span>
        </li>
        <li arg-list-item>
          <span arg-list-leading aria-hidden="true">2</span>
          <span arg-list-title>Informe o endereço</span>
        </li>
        <li arg-list-item>
          <span arg-list-leading aria-hidden="true">3</span>
          <span arg-list-title>Pague e acompanhe</span>
        </li>
      </ol>
    `,
  }),
};
