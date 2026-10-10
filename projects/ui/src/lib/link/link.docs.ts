import { DocPage } from '../../docs/doc-page';
import { LinkExternalExample } from './examples/link-external.example';
import { LinkInlineExample } from './examples/link-inline.example';
import { LinkMutedExample } from './examples/link-muted.example';
import { ArgLink } from './link';

export const LINK_DOCS: DocPage = {
  slug: 'link',
  title: 'Link',
  category: 'Componentes',
  summary:
    'Leva a outra página ou endereço. Sempre sublinhado, para não depender só da cor. Para ações (salvar, enviar), use o Button.',
  component: ArgLink,
  hostElement: 'a',
  playgroundContent: 'Ver documentação',
  examples: [
    { name: 'No texto', component: LinkInlineExample },
    {
      name: 'Externo',
      description:
        'Abre em nova aba, com o ícone e o aviso "(abre em nova aba)" para leitores de tela.',
      component: LinkExternalExample,
    },
    { name: 'Discreto', description: 'Para rodapés e metadados.', component: LinkMutedExample },
  ],
  guidelines: {
    do: [
      'Escreva o destino no texto: "guia de cuidados", não "clique aqui".',
      'Use `external` sempre que o link abrir outra aba.',
      'Com o router, junte com `routerLink`: `<a arg-link routerLink="/ajuda">`.',
    ],
    dont: [
      'Não use link para ações que mudam dados: isso é um botão.',
      'Não tire o sublinhado: a cor sozinha não indica que é um link.',
    ],
  },
  accessibility: [
    'É um `<a>` nativo: Enter segue o link e o foco aparece com o anel de foco.',
    'Em `external`, o leitor de tela lê o texto e o aviso: "guia de cuidados (abre em nova aba)". O ícone é decorativo.',
    'O hover engrossa o sublinhado, além de mudar a cor.',
  ],
};
