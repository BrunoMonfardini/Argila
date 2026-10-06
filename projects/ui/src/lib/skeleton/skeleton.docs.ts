import { DocPage } from '../../docs/doc-page';
import { SkeletonCardExample } from './examples/skeleton-card.example';
import { SkeletonParagraphExample } from './examples/skeleton-paragraph.example';
import { SkeletonShapesExample } from './examples/skeleton-shapes.example';
import { SkeletonStaticExample } from './examples/skeleton-static.example';
import { ArgSkeleton } from './skeleton';

export const SKELETON_DOCS: DocPage = {
  slug: 'skeleton',
  title: 'Skeleton',
  category: 'Componentes',
  summary:
    'Espaço reservado com brilho enquanto o conteúdo carrega. Mostra a forma do que vem e evita que a tela pule quando os dados chegam.',
  component: ArgSkeleton,
  playgroundInputs: { width: '16rem' },
  examples: [
    { name: 'Formas', component: SkeletonShapesExample },
    {
      name: 'Parágrafo',
      description: 'Varie as larguras e deixe a última linha mais curta.',
      component: SkeletonParagraphExample,
    },
    {
      name: 'Card',
      description: 'Imagem, título, preço e ação de um card de produto.',
      component: SkeletonCardExample,
    },
    {
      name: 'Estático',
      description: 'Sem brilho: para listas longas ou quando o movimento distrai.',
      component: SkeletonStaticExample,
    },
  ],
  guidelines: {
    do: [
      'Use no primeiro carregamento de conteúdo com forma conhecida: listas, cards, perfis.',
      'Imite o tamanho real do conteúdo, para a tela não pular quando ele chegar.',
    ],
    dont: [
      'Não use para ações do usuário que atualizam o que já está na tela: use o `loading` do botão.',
      'Não mostre skeleton em esperas abaixo de ~300 ms.',
    ],
  },
  accessibility: [
    'É sempre decorativo (`aria-hidden="true"`): anuncie o carregamento no contêiner, com `aria-busy="true"` e um `aria-label`.',
    'Com `prefers-reduced-motion`, o brilho para.',
  ],
};
