import { DocCategory, DocPage, pagePath } from '../registry';

export interface DocNavLink {
  label: string;
  path: string;
  /** Texto usado também na busca da barra lateral. */
  summary?: string;
}

export interface DocNavSection {
  title: string;
  links: DocNavLink[];
}

const CATEGORY_ORDER: DocCategory[] = ['Fundamentos', 'Componentes', 'Padrões'];

/** Páginas próprias do catálogo, que não vêm de um `*.docs.ts`. */
export const FOUNDATION_LINKS: DocNavLink[] = [
  {
    label: 'Tokens',
    path: '/fundamentos/tokens',
    summary: 'Cores, espaçamento, raio e tipografia, e como um produto muda a aparência.',
  },
  {
    label: 'Ícones',
    path: '/fundamentos/icones',
    summary: 'Os ícones desenhados pelo time, com busca e código para copiar.',
  },
];

/** Seções da barra lateral, na ordem em que aparecem; seções vazias somem. */
export function buildNavigation(pages: readonly DocPage[]): DocNavSection[] {
  const sections: DocNavSection[] = [{ title: 'Começo', links: [{ label: 'Início', path: '/' }] }];
  for (const category of CATEGORY_ORDER) {
    const links: DocNavLink[] = pages
      .filter((page) => page.category === category)
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
      .map((page) => ({ label: page.title, path: pagePath(page), summary: page.summary }));
    if (category === 'Fundamentos') {
      links.unshift(...FOUNDATION_LINKS);
    }
    if (links.length) {
      sections.push({ title: category, links });
    }
  }
  return sections;
}

/** Sem acento e em minúsculas, para a busca achar "padroes" em "Padrões". */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/** Filtra os links pelo título e pelo resumo; seções sem resultado somem. */
export function filterNavigation(sections: DocNavSection[], query: string): DocNavSection[] {
  const term = normalize(query.trim());
  if (!term) return sections;
  return sections
    .map((section) => ({
      ...section,
      links: section.links.filter((link) =>
        normalize(`${link.label} ${link.summary ?? ''}`).includes(term),
      ),
    }))
    .filter((section) => section.links.length);
}
