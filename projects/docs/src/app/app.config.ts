import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { argIconsAll, provideArgIcons, provideArgila } from '@brunomonfardini/ui';
import { provideDocRouter } from './app.routes';
import { DOC_SEGMENTS } from './segments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideDocRouter(),
    // O catálogo mostra todos os ícones; um produto registra só os que usa.
    provideArgIcons(argIconsAll),
    // Segmentos de exemplo, para a barra de tema; o catálogo não aplica nenhum ao iniciar
    provideArgila({ segments: DOC_SEGMENTS }),
  ],
};
