import {
  ARG_COMPONENTS,
  ARG_DESIGN_SYSTEMS,
  ArgComponentName,
  ArgDesignSystem,
  ArgStyle,
  curatedComponents,
} from '@brunomonfardini/ui';
import type { ManifestPage } from './manifest';
import type { DocPage } from './registry';

/**
 * Como um design system trata a página de um componente:
 * - `curado`: tem pele própria no DS;
 * - `herdado`: usa a aparência padrão, sem curadoria;
 * - `fora`: não faz parte do DS e some da navegação dele;
 * - `exclusivo`: só existe neste DS.
 */
export type DocAvailability = 'curado' | 'herdado' | 'fora' | 'exclusivo';

export interface DocDesignSystemStatus {
  id: ArgStyle;
  name: string;
  status: DocAvailability;
}

/** Os design systems oferecidos aos produtos (sem os internos, como o Molde). */
export const PRODUCT_DESIGN_SYSTEMS: readonly ArgDesignSystem[] = Object.values(
  ARG_DESIGN_SYSTEMS,
).filter((ds: ArgDesignSystem) => !ds.interno);

/**
 * O componente do núcleo de uma página, pela pasta do `*.docs.ts`
 * (`projects/ui/src/lib/choice/choice.docs.ts` → `choice`).
 */
export function coreComponentOf(file: string | undefined): ArgComponentName | undefined {
  const folder = /\/lib\/([\w-]+)\/[\w-]+\.docs\.ts$/.exec(file ?? '')?.[1];
  return ARG_COMPONENTS.find((name) => name === folder);
}

/**
 * Situação da página no design system. Páginas que não são de componente
 * (padrões, templates, "Sobre") valem em todos: `undefined`.
 */
export function availabilityIn(
  style: ArgStyle,
  page: DocPage,
  generated: ManifestPage | undefined,
): DocAvailability | undefined {
  if (page.designSystem) return page.designSystem === style ? 'exclusivo' : 'fora';
  const component = coreComponentOf(generated?.file);
  if (!component) return undefined;
  const ds: ArgDesignSystem = ARG_DESIGN_SYSTEMS[style];
  if (ds.componentes.fora.includes(component)) return 'fora';
  return curatedComponents(ds).includes(component) ? 'curado' : 'herdado';
}

/** A linha "Disponível em": a situação da página em cada DS de produto. */
export function availabilityAcross(
  page: DocPage,
  generated: ManifestPage | undefined,
): DocDesignSystemStatus[] {
  return PRODUCT_DESIGN_SYSTEMS.flatMap((ds) => {
    const id = ds.id as ArgStyle;
    const status = availabilityIn(id, page, generated);
    return status ? [{ id, name: ds.nome, status }] : [];
  });
}

/** As páginas que aparecem na navegação do design system: as "fora" somem. */
export function pagesIn(
  style: ArgStyle,
  pages: readonly DocPage[],
  generatedOf: (page: DocPage) => ManifestPage | undefined,
): DocPage[] {
  return pages.filter((page) => availabilityIn(style, page, generatedOf(page)) !== 'fora');
}
