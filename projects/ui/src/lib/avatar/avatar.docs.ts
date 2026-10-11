import { DocPage } from '../../docs/doc-page';
import { ArgAvatar } from './avatar';
import { AvatarPhotoExample } from './examples/avatar-photo.example';
import { AvatarSizesExample } from './examples/avatar-sizes.example';
import { AvatarWithNameExample } from './examples/avatar-with-name.example';

export const AVATAR_DOCS: DocPage = {
  slug: 'avatar',
  title: 'Avatar',
  category: 'Componentes',
  summary:
    'Foto de uma pessoa ou pet. Sem foto, ou se ela não carregar, mostra as iniciais do nome.',
  component: ArgAvatar,
  playgroundInputs: { name: 'Maria Souza' },
  examples: [
    { name: 'Iniciais e tamanhos', component: AvatarSizesExample },
    { name: 'Foto', component: AvatarPhotoExample },
    { name: 'Com o nome ao lado', component: AvatarWithNameExample },
  ],
  guidelines: {
    do: [
      'Passe sempre o `name`: ele é o texto alternativo da foto e a fonte das iniciais.',
      'Use `decorative` quando o nome já está escrito ao lado.',
    ],
    dont: [
      'Não use o avatar como único jeito de identificar alguém numa lista: escreva o nome.',
      'Não use para logotipos de empresa: o recorte redondo corta o desenho.',
    ],
  },
  accessibility: [
    'Com foto, é um `<img>` com o nome no `alt`. Sem foto, as iniciais ficam ocultas e o avatar recebe `role="img"` com o nome completo: o leitor lê "Maria Souza", não "MS".',
    'Com `decorative`, o avatar sai da árvore de acessibilidade.',
    'As iniciais usam a cor da marca sobre o fundo suave, um par testado no contraste.',
  ],
};
