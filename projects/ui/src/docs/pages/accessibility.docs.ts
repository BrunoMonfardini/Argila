import { DocPage } from '../doc-page';

export const ACCESSIBILITY_DOCS: DocPage = {
  slug: 'acessibilidade',
  title: 'Acessibilidade',
  category: 'Guias',
  summary:
    'O que o Argila garante em todo design system e toda paleta, e como isso é testado: contraste, teclado, leitor de tela e movimento.',
  examples: [],
  content: [
    {
      heading: 'Princípios',
      body: [
        'Elementos nativos primeiro: um botão é um `<button>`, um link é um `<a>`. ARIA só onde o HTML não basta.',
        'O design system muda a aparência, nunca o comportamento: teclado, foco e nomes acessíveis são os mesmos no Argila, no Punk ou no Windows XP.',
      ],
    },
    {
      heading: 'Contraste',
      body: [
        'Texto e controles passam no WCAG AA (4,5:1 no texto, 3:1 em bordas e ícones) em cada design system × paleta × modo. A paleta Alto contraste passa no AAA (7:1).',
        'As cores de marca da lista fixa só são oferecidas onde passam no par: `ArgTheme.allowedColors()` sai do mesmo teste.',
      ],
    },
    {
      heading: 'Teclado',
      body: [
        'Tudo funciona sem mouse, com o foco sempre visível. Componentes compostos seguem o padrão do WAI-ARIA: setas nas abas e nos menus, Esc fecha camadas, o foco volta para quem abriu um diálogo.',
        'Cada página de componente lista os atalhos na aba Acessibilidade.',
      ],
    },
    {
      heading: 'Leitor de tela',
      body: [
        'Todo controle tem nome acessível; ícones sozinhos exigem `label`. Avisos usam `role="status"` ou `role="alert"` pelo tom, e mudanças importantes são anunciadas sem mover o foco.',
      ],
    },
    {
      heading: 'Movimento',
      body: [
        'Animações respeitam `prefers-reduced-motion`: com a preferência ligada, somem os movimentos que não carregam informação.',
      ],
    },
    {
      heading: 'Como o Argila testa',
      body: [
        'Cada componente tem testes unitários com verificações automáticas de acessibilidade, e o catálogo inteiro passa nelas, página por página.',
        'O teste de contraste lê os tokens de cada design system e paleta; o checkup visual percorre o catálogo em todas as combinações, medindo o contraste do texto renderizado e a rolagem para o lado.',
      ],
    },
  ],
};
