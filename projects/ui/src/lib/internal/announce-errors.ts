import { Signal, effect, inject, untracked } from '@angular/core';
import { ArgAnnouncer } from './announcer';

/**
 * Anuncia o erro de um campo quando ele aparece ou muda, como
 * "E-mail: Informe um e-mail.". O erro que já vem na primeira renderização
 * não é anunciado: ele chega pelo `aria-describedby` quando o campo recebe
 * foco. Chame num contexto de injeção, como o construtor do componente.
 */
export function announceErrors(
  error: Signal<string | null | undefined>,
  label: Signal<string>,
): void {
  const announcer = inject(ArgAnnouncer);
  let previous: string | null | undefined;
  let first = true;
  effect(() => {
    const current = error();
    if (!first && current && current !== previous) {
      untracked(() => announcer.announce(`${label()}: ${current}`));
    }
    previous = current;
    first = false;
  });
}
