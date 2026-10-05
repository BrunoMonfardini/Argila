import {
  EnvironmentProviders,
  Injectable,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import type { ArgIconDef } from './icon-def';
import type { ArgIconName } from './icons.generated';

/**
 * Ícones registrados na aplicação. Único para toda a aplicação, então rotas
 * carregadas sob demanda podem registrar os seus com `provideArgIcons`.
 */
@Injectable({ providedIn: 'root' })
export class ArgIconRegistry {
  private readonly icons = new Map<ArgIconName, string>();

  register(icons: readonly ArgIconDef[]): void {
    for (const icon of icons) {
      this.icons.set(icon.name, icon.svg);
    }
  }

  /** O desenho do ícone, ou `undefined` se ele não foi registrado. */
  get(name: ArgIconName): string | undefined {
    return this.icons.get(name);
  }
}

/**
 * Registra os ícones que a aplicação usa. Só eles entram no bundle:
 *
 * ```ts
 * providers: [provideArgIcons([argIconPlus, argIconTrash])]
 * ```
 */
export function provideArgIcons(icons: readonly ArgIconDef[]): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => inject(ArgIconRegistry).register(icons)),
  ]);
}
