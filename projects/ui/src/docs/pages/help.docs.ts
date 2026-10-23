import { DocPage } from '../doc-page';

export const HELP_DOCS: DocPage = {
  slug: 'ajuda',
  title: 'Ajuda',
  category: 'Guias',
  summary: 'Perguntas frequentes, como pedir um componente e como contribuir com o Argila.',
  examples: [],
  content: [
    {
      heading: 'Perguntas frequentes',
      body: [
        'Posso usar uma cor fora da lista fixa? Não: só as 16 cores de `ARG_BRAND_COLORS`, e só onde passam no contraste. É isso que garante o contraste em toda combinação.',
        'Um componente não aparece no meu design system. Ele está "fora" desse design system: a página dele mostra em quais outros ele existe.',
        'Quero as cores e o fundo a partir de uma imagem do produto. Em Ferramentas → Montar tema, envie a imagem em "A partir de uma imagem": o catálogo sugere o modo, escolhe as três cores mais próximas da lista fixa e, ao aplicar, usa a imagem como fundo com o véu mínimo para o texto continuar legível. A imagem não sai do navegador. Copie o segmento e ponha a imagem no produto, no caminho de `backgroundImage`.',
        'Posso misturar design systems na mesma tela? Não: o design system vale para a página inteira (`data-arg-style` no `<html>`).',
      ],
    },
    {
      heading: 'Pedir um componente',
      body: [
        'Abra uma issue no repositório com o problema que o componente resolve, onde ele aparece no produto e uma referência visual. Antes, veja se um padrão do catálogo já resolve com os componentes que existem.',
      ],
    },
    {
      heading: 'Contribuir',
      body: [
        'Cada componente tem o código, o CSS com tokens, os testes e o `*.docs.ts` lado a lado. Um PR passa no CI com testes, lint, contraste, arquitetura e duplicação; mudanças no pacote levam um changeset (`pnpm changeset`).',
      ],
    },
  ],
};
