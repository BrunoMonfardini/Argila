import { EnvironmentProviders, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Routes,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { PRODUCT_DESIGN_SYSTEMS } from './availability';
import { ComponentPage } from './pages/component-page/component-page';
import { DesignSystemPage } from './pages/design-system/design-system-page';
import { FoundationPage } from './pages/foundation/foundation-page';
import { FOUNDATION_TOPICS } from './pages/foundation/topics';
import { ThemeBuilderPage } from './pages/theme-builder/theme-builder-page';
import { HomePage } from './pages/home/home';
import { IconsPage } from './pages/icons/icons-page';
import { TokensPage } from './pages/tokens/tokens-page';
import { UpdatesPage } from './pages/updates/updates-page';
import { DOC_PAGES, findPage } from './registry';

/** Título da aba: "Button · Argila". */
export const pageTitle: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const page = findPage(
    inject(DOC_PAGES),
    route.paramMap.get('categoria') ?? '',
    route.paramMap.get('slug') ?? '',
  );
  return page ? `${page.title} · Argila` : 'Página não encontrada · Argila';
};

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Argila' },
  { path: 'comeco/atualizacoes', component: UpdatesPage, title: 'Atualizações · Argila' },
  // Uma página por design system de produto, montada do manifesto
  ...PRODUCT_DESIGN_SYSTEMS.map((ds) => ({
    path: `design-systems/${ds.id}`,
    component: DesignSystemPage,
    title: `${ds.nome} · Argila`,
    data: { id: ds.id },
  })),
  { path: 'fundacao/tokens', component: TokensPage, title: 'Tokens · Argila' },
  { path: 'fundacao/icones', component: IconsPage, title: 'Ícones · Argila' },
  ...FOUNDATION_TOPICS.map((topic) => ({
    path: `fundacao/${topic.slug}`,
    component: FoundationPage,
    title: `${topic.title} · Argila`,
    data: { slug: topic.slug },
  })),
  { path: 'ferramentas/montar-tema', component: ThemeBuilderPage, title: 'Montar tema · Argila' },
  // Endereços antigos, de antes de "Fundamentos" virar "Fundação"
  { path: 'fundamentos/:slug', redirectTo: 'fundacao/:slug' },
  { path: ':categoria/:slug', component: ComponentPage, title: pageTitle },
  { path: ':categoria/:slug/:aba', component: ComponentPage, title: pageTitle },
  { path: '**', redirectTo: '' },
];

/** Router do catálogo, igual no app e nos testes. */
export function provideDocRouter(): EnvironmentProviders {
  return provideRouter(
    routes,
    withComponentInputBinding(),
    withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
  );
}
