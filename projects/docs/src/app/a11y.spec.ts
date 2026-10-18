import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { a11yViolations } from '../../../ui/src/testing/a11y';
import { App } from './app';
import { provideDocRouter } from './app.routes';
import { ALL_DOC_PAGES, pagePath } from './registry';

/** O catálogo é o primeiro cliente do design system: as páginas inteiras passam nas verificações. */
describe('acessibilidade do catálogo', () => {
  // As abas de uma página completa; as outras páginas, na Visão geral
  const tabs = ['uso', 'codigo', 'acessibilidade'].map((tab) => `/componentes/button/${tab}`);
  const urls = [
    '/',
    '/fundacao/tokens',
    '/fundacao/icones',
    ...ALL_DOC_PAGES.map(pagePath),
    ...tabs,
  ];

  it.each(urls)('%s não tem violações', async (url) => {
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), provideArgIcons(argIconsAll)],
    });
    const fixture = TestBed.createComponent(App);

    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();

    const root: HTMLElement = fixture.nativeElement;
    // Sem o título, a página não renderizou e "sem violações" não diria nada
    expect(root.querySelector('main h1')).not.toBeNull();
    expect(a11yViolations(root)).toEqual([]);
  });
});
