import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
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
    for (const page of ALL_DOC_PAGES) {
      const names = page.examples.map((example) => example.name);
      expect(new Set(names).size, page.slug).toBe(names.length);
    }
  });

  it('renderiza todos os exemplos de todas as páginas', () => {
    TestBed.configureTestingModule({ providers: [provideArgIcons(argIconsAll)] });
    for (const page of ALL_DOC_PAGES) {
      for (const example of page.examples) {
        const fixture = TestBed.createComponent(example.component);
        fixture.detectChanges();
        const root: HTMLElement = fixture.nativeElement;
        expect(root.children.length, `${page.slug}: ${example.name}`).toBeGreaterThan(0);
        fixture.destroy();
      }
    }
  });
});
