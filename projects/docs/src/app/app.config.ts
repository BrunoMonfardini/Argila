import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { provideDocRouter } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideDocRouter(),
    // O catálogo mostra todos os ícones; um produto registra só os que usa.
    provideArgIcons(argIconsAll),
  ],
};
