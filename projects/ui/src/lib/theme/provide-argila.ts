import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { ARG_SEGMENTS, type ArgilaConfig } from './segments';
import { ArgTheme } from './theme';

/**
 * Configura o Argila no app: declara os segmentos e aplica o padrão ao iniciar.
 *
 * ```ts
 * provideArgila({
 *   segments: {
 *     essencial: { style: 'argila' },
 *     premium: { style: 'argila', palette: 'terrosa', scheme: 'dark' },
 *   },
 *   defaultSegment: 'essencial',
 * });
 * ```
 */
export function provideArgila<K extends string>(config: ArgilaConfig<K>): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ARG_SEGMENTS, useValue: config.segments ?? {} },
    provideEnvironmentInitializer(() => {
      if (config.defaultSegment) inject(ArgTheme).setSegment(config.defaultSegment);
    }),
  ]);
}
