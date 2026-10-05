import { DocPage } from '../registry';
import { buildNavigation, filterNavigation, normalize } from './navigation';

function page(title: string, category: DocPage['category'], summary = ''): DocPage {
  return { slug: title.toLowerCase(), title, category, summary, examples: [] };
}

describe('navegação do catálogo', () => {
  const pages = [
    page('Spinner', 'Componentes', 'Indicador de progresso'),
    page('Button', 'Componentes', 'Dispara uma ação'),
    page('Carregamento', 'Padrões', 'Skeleton e spinner juntos'),
  ];

  it('agrupa por categoria, em ordem alfabética, depois do Início', () => {
    const sections = buildNavigation(pages);

    expect(sections.map((s) => s.title)).toEqual(['Começo', 'Componentes', 'Padrões']);
    expect(sections[1].links.map((l) => l.label)).toEqual(['Button', 'Spinner']);
    expect(sections[1].links[0]).toEqual({
      label: 'Button',
      path: '/componentes/button',
      summary: 'Dispara uma ação',
    });
  });

  it('esconde categorias sem páginas', () => {
    expect(buildNavigation([]).map((s) => s.title)).toEqual(['Começo']);
  });

  it('busca pelo título e pelo resumo, sem diferenciar acento e maiúsculas', () => {
    const sections = buildNavigation(pages);

    expect(filterNavigation(sections, 'PROGRESSO')[0].links[0].label).toBe('Spinner');
    expect(filterNavigation(sections, 'padroes')).toEqual([]);
    expect(filterNavigation(sections, 'spinner').map((s) => s.title)).toEqual([
      'Componentes',
      'Padrões',
    ]);
  });

  it('busca vazia mostra tudo', () => {
    const sections = buildNavigation(pages);

    expect(filterNavigation(sections, '   ')).toBe(sections);
  });

  it('normaliza acentos', () => {
    expect(normalize('Padrões Ícones')).toBe('padroes icones');
  });
});
