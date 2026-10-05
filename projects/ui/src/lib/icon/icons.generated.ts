// Gerado por scripts/gerar-icones.ts a partir de projects/ui/icons/*.svg.
// Não edite à mão: desenhe o SVG e rode `pnpm icons`.
import type { ArgIconDef } from './icon-def';

export type ArgIconName = 'check' | 'plus' | 'x';

export const argIconCheck: ArgIconDef = { name: 'check', svg: '<path d="M5 12.5l4.5 4.5L19 7"/>' };
export const argIconPlus: ArgIconDef = { name: 'plus', svg: '<path d="M12 5v14M5 12h14"/>' };
export const argIconX: ArgIconDef = { name: 'x', svg: '<path d="M6 6l12 12M18 6L6 18"/>' };

/** Todos os ícones. Prefira registrar só os que o produto usa. */
export const argIconsAll: readonly ArgIconDef[] = [argIconCheck, argIconPlus, argIconX];
