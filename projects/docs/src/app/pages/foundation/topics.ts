import type { ManifestToken } from '../../manifest';

/** Como a página desenha a amostra dos tokens do tópico. */
export type FoundationSample = 'color' | 'type' | 'space' | 'shape' | 'motion';

export interface FoundationTopic {
  slug: string;
  title: string;
  summary: string;
  sample: FoundationSample;
  /** Os tokens do tópico, pelo nome. */
  includes: (name: string) => boolean;
}

/** As páginas da Fundação além de Tokens e Ícones, na ordem da navegação. */
export const FOUNDATION_TOPICS: FoundationTopic[] = [
  {
    slug: 'cores',
    title: 'Cores',
    summary:
      'As cores semânticas (marca, superfícies, texto, bordas e feedback) no design system, na paleta e no modo escolhidos.',
    sample: 'color',
    includes: (name) => name.startsWith('--arg-color-'),
  },
  {
    slug: 'tipografia',
    title: 'Tipografia',
    summary:
      'Famílias, tamanhos, pesos e alturas de linha: a escala de texto de cada design system.',
    sample: 'type',
    includes: (name) => /^--arg-(font-family|font-size|font-weight|line-height)/.test(name),
  },
  {
    slug: 'espacamento',
    title: 'Espaçamento',
    summary: 'A escala de espaços entre e dentro dos componentes, em múltiplos de 4px.',
    sample: 'space',
    includes: (name) => name.startsWith('--arg-space-'),
  },
  {
    slug: 'raio-e-elevacao',
    title: 'Raio e elevação',
    summary:
      'Os cantos por papel (controles, contêineres, pílula) e os níveis de sombra: o que mais muda de um design system para outro.',
    sample: 'shape',
    includes: (name) =>
      /^--arg-radius-/.test(name) || /^--arg-shadow-(sm|md|lg|[1-5]|control|field)$/.test(name),
  },
  {
    slug: 'movimento',
    title: 'Movimento',
    summary:
      'Durações e curva das transições. Com "reduzir movimento" ligado no sistema, as animações que não informam nada somem.',
    sample: 'motion',
    includes: (name) => name.startsWith('--arg-motion-'),
  },
];

export function findTopic(slug: string): FoundationTopic | undefined {
  return FOUNDATION_TOPICS.find((topic) => topic.slug === slug);
}

/** Os tokens do tópico, sem repetir (o semantic.css redefine alguns por mídia). */
export function topicTokens(
  topic: FoundationTopic,
  tokens: readonly ManifestToken[],
): ManifestToken[] {
  const seen = new Set<string>();
  return tokens.filter((token) => {
    if (!topic.includes(token.name) || seen.has(token.name)) return false;
    seen.add(token.name);
    return true;
  });
}
