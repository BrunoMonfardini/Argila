import { DocPage } from '../docs/doc-page';
import { PasswordCreateExample, PasswordLoginExample } from './examples/passwords.example';

export const PASSWORDS_PATTERN_DOCS: DocPage = {
  slug: 'senhas',
  title: 'Senhas',
  category: 'Padrões',
  summary: 'Como pedir, criar e recuperar senhas sem atrito e sem perder segurança.',
  pattern: {
    problem:
      'Regras escondidas, campo que não deixa ver o que foi digitado e senha confirmada duas vezes geram erro e desistência.',
    solution:
      'Mostre as regras antes de digitar, a força enquanto digita e um botão para ver a senha. Use o `autocomplete` certo, para o gerenciador de senhas ajudar.',
  },
  examples: [
    {
      name: 'Criar senha',
      description: 'Digite para ver a força; o olho mostra a senha.',
      component: PasswordCreateExample,
    },
    { name: 'Entrar', component: PasswordLoginExample },
  ],
  guidelines: {
    do: [
      '`autocomplete="new-password"` ao criar e `current-password` ao entrar.',
      'Deixe colar: gerenciadores de senha dependem disso.',
    ],
    dont: [
      'Não peça a senha duas vezes: o botão de mostrar resolve o erro de digitação.',
      'Não esconda as regras até a pessoa errar.',
    ],
  },
  related: ['field', 'input', 'icon-button', 'progress-bar'],
};
