import { ArgIconName } from '@brunomonfardini/ui';
import { DocCategory, DocPage, pagePath } from '../registry';

export interface DocNavLink {
  label: string;
  path: string;
  /** Texto usado também na busca do painel. */
  summary?: string;
}

/** Links de uma família, ex.: "Formulário". Sem título, ficam soltos na seção. */
export interface DocNavGroup {
  title?: string;
  links: DocNavLink[];
}

/** Uma seção da barra de ícones; ao clicar, o painel mostra os grupos dela. */
export interface DocNavSection {
  id: string;
  title: string;
  icon: ArgIconName;
  groups: DocNavGroup[];
}

interface SectionSpec {
  id: string;
  title: string;
  icon: ArgIconName;
  category?: DocCategory;
  /** Páginas próprias do catálogo, que não vêm de um `*.docs.ts`; vêm primeiro. */
  links?: DocNavLink[];
}

/** Ordem das famílias de componentes; os exclusivos do DS vêm por último. */
export const COMPONENT_GROUPS = [
  'Ações',
  'Formulário',
  'Seleção',
  'Exibição de dados',
  'Feedback',
  'Carregamento',
  'Camadas',
  'Navegação',
  'Domínio',
  'Exclusivos',
];

/** Páginas da Fundação feitas pelo catálogo. */
export const FOUNDATION_LINKS: DocNavLink[] = [
  {
    label: 'Tokens',
    path: '/fundacao/tokens',
    summary: 'Cores, espaçamento, raio e tipografia, e como um produto muda a aparência.',
  },
  {
    label: 'Ícones',
    path: '/fundacao/icones',
    summary: 'Os ícones desenhados pelo time, com busca e código para copiar.',
  },
];

const SECTIONS: SectionSpec[] = [
  { id: 'comeco', title: 'Começo', icon: 'rocket', links: [{ label: 'Início', path: '/' }] },
  { id: 'design-systems', title: 'Design systems', icon: 'layers', category: 'Design systems' },
  {
    id: 'fundacao',
    title: 'Fundação',
    icon: 'book',
    category: 'Fundação',
    links: FOUNDATION_LINKS,
  },
  { id: 'componentes', title: 'Componentes', icon: 'layout', category: 'Componentes' },
  { id: 'padroes', title: 'Padrões', icon: 'sparkles', category: 'Padrões' },
  { id: 'templates', title: 'Templates', icon: 'copy', category: 'Templates' },
];

/** "Sobre ..." abre a seção; o resto vai em ordem alfabética. */
function byTitle(a: DocPage, b: DocPage): number {
  if ((a.slug === 'sobre') !== (b.slug === 'sobre')) return a.slug === 'sobre' ? -1 : 1;
  return a.title.localeCompare(b.title, 'pt-BR');
}

function link(page: DocPage): DocNavLink {
  return { label: page.title, path: pagePath(page), summary: page.summary };
}

function groupsOf(pages: DocPage[]): DocNavGroup[] {
  const loose = pages.filter((page) => !page.group).map(link);
  const grouped = [...new Set(pages.map((page) => page.group).filter((g) => g !== undefined))]
    .sort((a, b) => order(a) - order(b))
    .map((title) => ({
      title,
      links: pages.filter((page) => page.group === title).map(link),
    }));
  return loose.length ? [{ links: loose }, ...grouped] : grouped;
}

/** Famílias conhecidas na ordem fixa; as desconhecidas, no fim. */
function order(group: string): number {
  const index = COMPONENT_GROUPS.indexOf(group);
  return index === -1 ? COMPONENT_GROUPS.length : index;
}

/** Seções da barra de ícones, na ordem em que aparecem; seções vazias somem. */
export function buildNavigation(pages: readonly DocPage[]): DocNavSection[] {
  return SECTIONS.map(({ id, title, icon, category, links = [] }) => {
    const own = category ? pages.filter((page) => page.category === category).sort(byTitle) : [];
    const groups = groupsOf(own);
    if (links.length) {
      if (groups[0] && !groups[0].title) groups[0].links.unshift(...links);
      else groups.unshift({ links: [...links] });
    }
    return { id, title, icon, groups };
  }).filter((section) => section.groups.length);
}

/** Todos os links de uma seção, na ordem do painel. */
export function sectionLinks(section: DocNavSection): DocNavLink[] {
  return section.groups.flatMap((group) => group.links);
}

/** Sem acento e em minúsculas, para a busca achar "padroes" em "Padrões". */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/** Filtra os links pelo título e pelo resumo; grupos e seções sem resultado somem. */
export function filterNavigation(sections: DocNavSection[], query: string): DocNavSection[] {
  const term = normalize(query.trim());
  if (!term) return sections;
  return sections
    .map((section) => ({
      ...section,
      groups: section.groups
        .map((group) => ({
          ...group,
          links: group.links.filter((link) =>
            normalize(`${link.label} ${link.summary ?? ''}`).includes(term),
          ),
        }))
        .filter((group) => group.links.length),
    }))
    .filter((section) => section.groups.length);
}

/** A seção da página atual: a que tem um link com o caminho da URL. */
export function sectionOf(sections: DocNavSection[], url: string): string | undefined {
  const path = url.split(/[?#;]/)[0];
  return sections.find((section) => sectionLinks(section).some((link) => link.path === path))?.id;
}
