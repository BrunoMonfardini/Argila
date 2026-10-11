import { DocPage } from '../../docs/doc-page';
import { ArgCard } from './card';
import { CardBasicExample } from './examples/card-basic.example';
import { CardClickableExample } from './examples/card-clickable.example';
import { CardMediaExample } from './examples/card-media.example';

export const CARD_DOCS: DocPage = {
  slug: 'card',
  title: 'Card',
  category: 'Componentes',
  summary:
    'Agrupa o resumo de uma coisa (cliente, pet, serviço) com áreas de cabeçalho, conteúdo e ações. Com `arg-card-link`, o card inteiro vira clicável. Importe tudo de uma vez com `ARG_CARD`.',
  component: ArgCard,
  playground: false,
  examples: [
    { name: 'Áreas', component: CardBasicExample },
    {
      name: 'Card inteiro clicável',
      description:
        'O link (ou botão) fica no título e se estica sobre o card. Os outros botões continuam com clique e foco próprios.',
      component: CardClickableExample,
    },
    { name: 'Com imagem', component: CardMediaExample },
  ],
  guidelines: {
    do: [
      'Para um card clicável, ponha `arg-card-link` no link do título: o leitor de tela lê só o título, não o card inteiro.',
      'Use `<article>` para algo que faz sentido sozinho e `<li arg-card>` dentro de uma `<ul>` para uma coleção.',
      'Use o nível de título certo para a página (`<h2>`, `<h3>`…).',
    ],
    dont: [
      'Não envolva o card inteiro num `<a>`: os botões de dentro deixam de funcionar e o nome do link vira todo o texto.',
      'Não use mais de um `arg-card-link` no mesmo card.',
      'Não ponha num card clicável texto que a pessoa precise selecionar e copiar.',
    ],
  },
  accessibility: [
    'O card clicável é um link ou botão nativo, alcançado pelo Tab; o anel de foco contorna o card inteiro.',
    'Os outros controles do card são alcançados pelo Tab depois do link, na ordem do texto.',
    'Em alto contraste, o card mantém a borda e o título usa a cor de link do sistema.',
  ],
};
