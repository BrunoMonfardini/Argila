import { InjectionToken } from '@angular/core';
import {
  manifestKey,
  type Manifest,
  type ManifestPage,
} from '../../../../scripts/lib/manifest-types';
import generated from '../generated/manifest.json';
import type { DocPage } from './registry';

export type {
  Manifest,
  ManifestComponent,
  ManifestCssToken,
  ManifestInput,
  ManifestPage,
  ManifestToken,
} from '../../../../scripts/lib/manifest-types';

/** Manifesto gerado do código (pnpm manifest). Nos testes, substitua por um fixo. */
export const DOC_MANIFEST = new InjectionToken<Manifest>('DOC_MANIFEST', {
  providedIn: 'root',
  factory: () => generated as Manifest,
});

/** O que o manifesto sabe sobre uma página do registro. */
export function manifestPage(manifest: Manifest, page: DocPage): ManifestPage | undefined {
  return manifest.pages[manifestKey(page.category, page.slug)];
}
