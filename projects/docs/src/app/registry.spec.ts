import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { a11yViolations } from '../../../ui/src/testing/a11y';
import { ALL_DOC_PAGES, DocPage, categoryPath, findPage, pagePath } from './registry';

@Component({ template: '' })
class Empty {}

const PATTERN: DocPage = {
  slug: 'carregamento',
  title: 'Carregamento',
  category: 'Padrões',
  summary: 'Como carregar listas.',
  examples: [{ name: 'Lista', component: Empty }],
};

/**
 * Renderiza cada exemplo de cada página e devolve os nomes ("página: exemplo")
 * em que `check` deu verdadeiro.
 */
function renderAll(check: (root: HTMLElement, name: string) => boolean): string[] {
  const failed: string[] = [];
  for (const page of ALL_DOC_PAGES) {
    for (const example of page.examples) {
      const fixture = TestBed.createComponent(example.component);
      fixture.detectChanges();
      const name = `${page.slug}: ${example.name}`;
      if (check(fixture.nativeElement, name)) failed.push(name);
      fixture.destroy();
    }
  }
  return failed;
}

describe('registro do catálogo', () => {
  it('monta o caminho sem acento a partir da categoria', () => {
    expect(categoryPath('Padrões')).toBe('padroes');
    expect(pagePath(PATTERN)).toBe('/padroes/carregamento');
  });

  it('acha a página pela categoria e pelo slug', () => {
    expect(findPage([PATTERN], 'padroes', 'carregamento')).toBe(PATTERN);
    expect(findPage([PATTERN], 'componentes', 'carregamento')).toBeUndefined();
  });

  it('não repete slug dentro da mesma categoria', () => {
    const paths = ALL_DOC_PAGES.map(pagePath);

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('não repete nome de exemplo dentro de uma página', () => {
    const repeated = ALL_DOC_PAGES.filter((page) => {
      const names = page.examples.map((example) => example.name);
      return new Set(names).size !== names.length;
    }).map((page) => page.slug);

    expect(repeated).toEqual([]);
  });

  it('renderiza todos os exemplos de todas as páginas', () => {
    TestBed.configureTestingModule({ providers: [provideArgIcons(argIconsAll)] });

    const empty = renderAll((root) => root.children.length === 0);

    expect(empty).toEqual([]);
  });

  it('nenhum exemplo tem violação de acessibilidade', () => {
    TestBed.configureTestingModule({ providers: [provideArgIcons(argIconsAll)] });
    const violations: Record<string, unknown[]> = {};

    renderAll((root, name) => {
      const found = a11yViolations(root);
      if (found.length) violations[name] = found;
      return false;
    });

    expect(violations).toEqual({});
  });
});
