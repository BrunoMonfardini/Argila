import { DocPage } from '../docs/doc-page';
import { ColorActionsExample, ColorStatusExample } from './examples/color-usage.example';

export const COLOR_USAGE_PATTERN_DOCS: DocPage = {
  slug: 'aplicacao-de-cores',
  title: 'Aplicação de cores',
  category: 'Padrões',
  summary: 'Onde vai cada cor: marca nas ações, tons nas situações e nunca a cor sozinha.',
  pattern: {
    problem:
      'Cor demais tira o foco da ação principal, e cor como única informação some para quem não a distingue.',
    solution:
      'A cor da marca marca a ação principal (uma por tela); os tons (sucesso, aviso, erro, informação) marcam situações, sempre com texto ou ícone. Use só os tokens: a paleta e o design system trocam as cores, com contraste garantido.',
  },
  examples: [
    { name: 'Hierarquia das ações', component: ColorActionsExample },
    { name: 'Situações com tom', component: ColorStatusExample },
  ],
  guidelines: {
    do: [
      'Uma ação primária por tela.',
      'Cores só por token (`--arg-color-*`) ou pela lista fixa de cores de marca.',
    ],
    dont: [
      'Não use cor sozinha para informar: "Atrasado" é texto, o vermelho só reforça.',
      'Não escreva cores fixas (`#e00`) no produto: elas não acompanham a paleta nem o modo.',
    ],
  },
  related: ['button', 'badge', 'tag', 'alert'],
};
