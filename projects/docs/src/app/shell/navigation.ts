import { ArgIconName } from '@brunomonfardini/ui';
import { PRODUCT_DESIGN_SYSTEMS } from '../availability';
import { FOUNDATION_TOPICS } from '../pages/foundation/topics';
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
  /** As páginas da seção. */
  includes?: (page: DocPage) => boolean;
  /** Páginas próprias do catálogo, que não vêm de um `*.docs.ts`: antes das outras. */
  links?: DocNavLink[];
  /** Páginas próprias do catálogo que vêm depois das outras. */
  after?: DocNavLink[];
}

const inCategory = (category: DocCategory) => (page: DocPage) => page.category === category;
const guide = (slug: string) => (page: DocPage) => page.category === 'Guias' && page.slug === slug;

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
  ...FOUNDATION_TOPICS.map((topic) => ({
    label: topic.title,
    path: `/fundacao/${topic.slug}`,
    summary: topic.summary,
  })),
];

export const TOOL_LINKS: DocNavLink[] = [
  {
    label: 'Montar tema',
    path: '/ferramentas/montar-tema',
    summary: 'Escolha DS, paleta, cores, modo e transparência e copie o segmento ou o HTML.',
  },
];

/** Uma página por design system de produto, montada do manifesto. */
export const DESIGN_SYSTEM_LINKS: DocNavLink[] = PRODUCT_DESIGN_SYSTEMS.map((ds) => ({
  label: ds.nome,
  path: `/design-systems/${ds.id}`,
  summary: ds.linguagem,
}));

export const UPDATES_LINK: DocNavLink = {
  label: 'Atualizações',
  path: '/comeco/atualizacoes',
  summary: 'O que mudou em cada versão do pacote.',
};

const SECTIONS: SectionSpec[] = [
  {
    id: 'comeco',
    title: 'Começo',
    icon: 'rocket',
    links: [{ label: 'Início', path: '/' }],
    includes: guide('como-comecar'),
    after: [UPDATES_LINK],
  },
  {
    id: 'acessibilidade',
    title: 'Acessibilidade',
    icon: 'accessibility',
    includes: guide('acessibilidade'),
  },
  {
    id: 'design-systems',
    title: 'Design systems',
    icon: 'layers',
    includes: inCategory('Design systems'),
    after: DESIGN_SYSTEM_LINKS,
  },
  {
    id: 'fundacao',
    title: 'Fundação',
    icon: 'book',
    includes: inCategory('Fundação'),
    links: FOUNDATION_LINKS,
  },
  { id: 'componentes', title: 'Componentes', icon: 'layout', includes: inCategory('Componentes') },
  { id: 'padroes', title: 'Padrões', icon: 'sparkles', includes: inCategory('Padrões') },
  { id: 'templates', title: 'Templates', icon: 'copy', includes: inCategory('Templates') },
  { id: 'ferramentas', title: 'Ferramentas', icon: 'wrench', links: TOOL_LINKS },
  { id: 'ajuda', title: 'Ajuda', icon: 'help-circle', includes: guide('ajuda') },
];

/** "Sobre ..." abre a seção; o resto vai em ordem alfabética. */
function byTitle(a: DocPage, b: DocPage): number {
  if ((a.slug === 'sobre') !== (b.slug === 'sobre')) return a.slug === 'sobre' ? -1 : 1;
  return a.title.localeCompare(b.title, 'pt-BR');
}

function link(page: DocPage): DocNavLink {
  return { label: page.title, path: pagePath(page), summary: page.summary };
}

/** As famílias das páginas com `group`, na ordem fixa. */
function familiesOf(pages: DocPage[]): DocNavGroup[] {
  return [...new Set(pages.map((page) => page.group).filter((g) => g !== undefined))]
    .sort((a, b) => order(a) - order(b))
    .map((title) => ({
      title,
      links: pages.filter((page) => page.group === title).map(link),
    }));
}

/** Famílias conhecidas na ordem fixa; as desconhecidas, no fim. */
function order(group: string): number {
  const index = COMPONENT_GROUPS.indexOf(group);
  return index === -1 ? COMPONENT_GROUPS.length : index;
}

/**
 * Seções da barra de ícones, na ordem em que aparecem; seções vazias somem.
 * Em cada uma, os links soltos (os do catálogo e as páginas sem família)
 * vêm antes das famílias.
 */
export function buildNavigation(pages: readonly DocPage[]): DocNavSection[] {
  return SECTIONS.map(({ id, title, icon, includes, links = [], after = [] }) => {
    const own = includes ? pages.filter(includes).sort(byTitle) : [];
    const loose = [...links, ...own.filter((page) => !page.group).map(link), ...after];
    const families = familiesOf(own.filter((page) => page.group));
    return { id, title, icon, groups: loose.length ? [{ links: loose }, ...families] : families };
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

/** O link vale para o caminho: o mesmo, ou uma aba dele (`/componentes/button/codigo`). */
export function linkMatches(link: DocNavLink, path: string): boolean {
  return path === link.path || (link.path !== '/' && path.startsWith(`${link.path}/`));
}

/** A seção da página atual: a que tem um link com o caminho da URL. */
export function sectionOf(sections: DocNavSection[], url: string): string | undefined {
  const path = url.split(/[?#;]/)[0];
  return sections.find((section) => sectionLinks(section).some((link) => linkMatches(link, path)))
    ?.id;
}
