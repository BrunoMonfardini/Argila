import { DOCUMENT, DestroyRef, Injectable, inject, signal } from '@angular/core';

/**
 * Muda sempre que o tema do `<html>` muda (modo de cor, marca ou tokens
 * aplicados pelo ArgTheme). Páginas que leem valores calculados de tokens
 * dependem deste sinal para se atualizar.
 */
@Injectable({ providedIn: 'root' })
export class DocThemeVersion {
  private readonly _version = signal(0);
  readonly version = this._version.asReadonly();

  constructor() {
    const root = inject(DOCUMENT).documentElement;
    const observer = new MutationObserver(() => this._version.update((v) => v + 1));
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-arg-theme', 'data-arg-brand', 'style'],
    });
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
