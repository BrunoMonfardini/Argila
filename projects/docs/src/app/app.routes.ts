import { EnvironmentProviders, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Routes,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { ComponentPage } from './pages/component-page/component-page';
import { HomePage } from './pages/home/home';
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
  { path: ':categoria/:slug', component: ComponentPage, title: pageTitle },
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
