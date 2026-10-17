/**
 * Manifestos dos design systems, lidos direto dos `ds.ts` da biblioteca.
 * Os manifestos só importam tipos, então rodam no Node sem compilação: os
 * testes, o checkup e os geradores leem a mesma fonte que o `ArgTheme`.
 */
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ARG_DEFAULT_STYLE,
  type ArgDesignSystem,
} from '../../projects/ui/src/lib/design-systems/design-system.ts';

export type { ArgDesignSystem };

/** Pasta dos manifestos, a partir da raiz do repositório. */
export const DESIGN_SYSTEMS_SOURCE = 'projects/ui/src/lib/design-systems';

/** Pasta do CSS dos design systems, a partir da raiz do repositório. */
export const DESIGN_SYSTEMS_TOKENS = 'projects/ui/tokens/design-systems';

/** Uma pasta por design system, cada uma com o seu `ds.ts`. */
export function designSystemIds(root: string): string[] {
  return readdirSync(resolve(root, DESIGN_SYSTEMS_SOURCE), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** Carrega o manifesto de cada pasta: o único valor exportado pelo `ds.ts`. */
export async function loadDesignSystems(root: string): Promise<ArgDesignSystem[]> {
  return Promise.all(
    designSystemIds(root).map(async (id) => {
      const file = resolve(root, DESIGN_SYSTEMS_SOURCE, id, 'ds.ts');
      if (!existsSync(file)) throw new Error(`design system sem manifesto: ${id}/ds.ts`);
      const exported = Object.values(await import(pathToFileURL(file).href));
      if (exported.length !== 1) {
        throw new Error(`${id}/ds.ts deve exportar só o manifesto (exporta ${exported.length})`);
      }
      return exported[0] as ArgDesignSystem;
    }),
  );
}

/**
 * Raiz do CSS de um design system. O padrão também vale sem `data-arg-style`,
 * mas não nos temas antigos (`data-arg-brand`), que trazem a própria forma.
 */
export function rootSelector(id: string): string {
  return id === ARG_DEFAULT_STYLE
    ? `:root:is([data-arg-style='${id}'], :not([data-arg-style], [data-arg-brand]))`
    : `:root[data-arg-style='${id}']`;
}

/** Atributos do `<html>` de uma combinação: `nativa` é o padrão, sem `data-arg-palette`. */
export function rootAttributes(style: string, palette: string): Record<string, string> {
  return {
    'data-arg-style': style,
    ...(palette === 'nativa' ? {} : { 'data-arg-palette': palette }),
  };
}
