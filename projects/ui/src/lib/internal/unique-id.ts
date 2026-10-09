import { Injectable, inject } from '@angular/core';

/**
 * Contador de ids da aplicação. Fica num serviço, não numa variável do
 * módulo: no SSR cada requisição tem a sua instância, e servidor e navegador
 * geram os mesmos ids na mesma ordem de criação dos componentes.
 */
@Injectable({ providedIn: 'root' })
export class ArgIdGenerator {
  private count = 0;

  next(prefix: string): string {
    this.count++;
    return `${prefix}-${this.count}`;
  }
}

/**
 * Id único para ligar elementos por atributo (`for`, `aria-describedby`,
 * `aria-controls`). Chame num contexto de injeção, como um campo da classe:
 *
 * ```ts
 * protected readonly hintId = injectUniqueId('arg-field-hint');
 * ```
 */
export function injectUniqueId(prefix = 'arg'): string {
  return inject(ArgIdGenerator).next(prefix);
}
