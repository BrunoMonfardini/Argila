import { DocPage } from '../registry';
import {
  buildNavigation,
  filterNavigation,
  normalize,
  sectionLinks,
  sectionOf,
} from './navigation';

function page(title: string, category: DocPage['category'], extra: Partial<DocPage> = {}): DocPage {
  return { slug: title.toLowerCase(), title, category, summary: '', examples: [], ...extra };
}

describe('navegação do catálogo', () => {
  const pages = [
    page('Spinner', 'Componentes', { group: 'Carregamento', summary: 'Indicador de progresso' }),
    page('Button', 'Componentes', { group: 'Ações', summary: 'Dispara uma ação' }),
    page('Link', 'Componentes', { group: 'Ações' }),
    page('Janela', 'Componentes', { group: 'Exclusivos', designSystem: 'windows-xp' }),
    page('Carregamento', 'Padrões', { summary: 'Skeleton e spinner juntos' }),
    page('Receipt', 'Templates'),
    page('Sobre templates', 'Templates', { slug: 'sobre' }),
  ];

  it('monta as seções na ordem da barra, com ícone, e esconde as vazias', () => {
    const sections = buildNavigation(pages);

    expect(sections.map((s) => [s.id, s.title, s.icon])).toEqual([
      ['comeco', 'Começo', 'rocket'],
      ['fundacao', 'Fundação', 'book'],
      ['componentes', 'Componentes', 'layout'],
      ['padroes', 'Padrões', 'sparkles'],
      ['templates', 'Templates', 'copy'],
    ]);
  });

  it('agrupa os componentes nas famílias, na ordem fixa, com os exclusivos no fim', () => {
    const components = buildNavigation(pages).find((s) => s.id === 'componentes')!;

    expect(components.groups.map((g) => g.title)).toEqual(['Ações', 'Carregamento', 'Exclusivos']);
    expect(components.groups[0].links).toEqual([
      { label: 'Button', path: '/componentes/button', summary: 'Dispara uma ação' },
      { label: 'Link', path: '/componentes/link', summary: '' },
    ]);
  });

  it('família desconhecida vai para o fim; páginas sem família ficam soltas no começo', () => {
    const sections = buildNavigation([
      page('Zeta', 'Componentes', { group: 'Nova' }),
      page('Alfa', 'Componentes', { group: 'Ações' }),
      page('Solta', 'Componentes'),
    ]);
    const components = sections.find((s) => s.id === 'componentes')!;

    expect(components.groups.map((g) => g.title)).toEqual([undefined, 'Ações', 'Nova']);
  });

  it('"Sobre" abre a seção; Fundação sempre tem Tokens e Ícones', () => {
    const sections = buildNavigation([...pages, page('Cores', 'Fundação')]);
    const labels = (id: string) =>
      sectionLinks(sections.find((s) => s.id === id)!).map((l) => l.label);

    expect(labels('templates')).toEqual(['Sobre templates', 'Receipt']);
    expect(labels('fundacao')).toEqual(['Tokens', 'Ícones', 'Cores']);
    expect(labels('comeco')).toEqual(['Início']);
  });

  it('busca pelo título e pelo resumo, sem diferenciar acento e maiúsculas', () => {
    const sections = buildNavigation(pages);
    const titles = (query: string) => filterNavigation(sections, query).map((s) => s.title);

    expect(sectionLinks(filterNavigation(sections, 'PROGRESSO')[0])[0].label).toBe('Spinner');
    expect(filterNavigation(sections, 'padroes')).toEqual([]);
    expect(titles('spinner')).toEqual(['Componentes', 'Padrões']);
    expect(filterNavigation(sections, 'button')[0].groups.map((g) => g.title)).toEqual(['Ações']);
  });

  it('busca vazia mostra tudo', () => {
    const sections = buildNavigation(pages);

    expect(filterNavigation(sections, '   ')).toBe(sections);
  });

  it('acha a seção da página atual pelo caminho, sem query nem fragmento', () => {
    const sections = buildNavigation(pages);

    expect(sectionOf(sections, '/componentes/button?variant=primary#exemplos')).toBe('componentes');
    expect(sectionOf(sections, '/componentes/button/codigo')).toBe('componentes');
    expect(sectionOf(sections, '/')).toBe('comeco');
    expect(sectionOf(sections, '/nao-existe')).toBeUndefined();
  });

  it('normaliza acentos', () => {
    expect(normalize('Padrões Ícones')).toBe('padroes icones');
  });
});
