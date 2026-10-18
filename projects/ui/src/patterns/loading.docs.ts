import { DocPage } from '../docs/doc-page';
import {
  LoadingBlockExample,
  LoadingProgressExample,
  LoadingSaveExample,
} from './examples/loading.example';

export const LOADING_PATTERN_DOCS: DocPage = {
  slug: 'carregamentos',
  title: 'Carregamentos',
  category: 'Padrões',
  summary: 'Como mostrar que algo está carregando, do tamanho certo para a espera.',
  pattern: {
    problem:
      'Esperar sem saber o que está acontecendo parece erro, e um aviso grande demais trava a tela inteira por uma espera pequena.',
    solution:
      'O aviso fica onde está a espera: no botão que salvou, no bloco que carrega ou, com duração conhecida, numa barra com quanto falta. Todo carregamento tem nome, para o leitor de tela.',
  },
  examples: [
    { name: 'Salvar no botão', component: LoadingSaveExample },
    { name: 'Bloco carregando', component: LoadingBlockExample },
    { name: 'Duração conhecida', component: LoadingProgressExample },
  ],
  guidelines: {
    do: [
      'Use `loading` no botão da ação: ele bloqueia o clique repetido e mantém a largura.',
      'Dê nome ao spinner e à barra (`label`).',
    ],
    dont: [
      'Não bloqueie a tela inteira por uma ação pequena.',
      'Não use barra de progresso sem saber o quanto falta.',
    ],
  },
  related: ['button', 'spinner', 'progress-bar', 'card'],
};
