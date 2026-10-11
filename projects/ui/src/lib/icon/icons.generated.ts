// Gerado por scripts/gerar-icones.ts a partir de projects/ui/icons/*.svg.
// Não edite à mão: desenhe o SVG e rode `pnpm icons`.
import type { ArgIconDef } from './icon-def';

export type ArgIconName = 'alert-circle' | 'alert-triangle' | 'check' | 'check-circle' | 'external-link' | 'info' | 'menu' | 'plus' | 'x';

export const argIconAlertCircle: ArgIconDef = { name: 'alert-circle', svg: '<circle cx="12" cy="12" r="10"/><path d="M12 7.5v5"/><path d="M12 16.5h.01"/>' };
export const argIconAlertTriangle: ArgIconDef = { name: 'alert-triangle', svg: '<path d="M10.27 4L2.52 17.5A2 2 0 0 0 4.25 20.5h15.5a2 2 0 0 0 1.73-3L13.73 4a2 2 0 0 0-3.46 0z"/><path d="M12 9.5v4"/><path d="M12 17h.01"/>' };
export const argIconCheck: ArgIconDef = { name: 'check', svg: '<path d="M5 12.5l4.5 4.5L19 7"/>' };
export const argIconCheckCircle: ArgIconDef = { name: 'check-circle', svg: '<circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9.5"/>' };
export const argIconExternalLink: ArgIconDef = { name: 'external-link', svg: '<path d="M13 4h7v7"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>' };
export const argIconInfo: ArgIconDef = { name: 'info', svg: '<circle cx="12" cy="12" r="10"/><path d="M12 11v5"/><path d="M12 8h.01"/>' };
export const argIconMenu: ArgIconDef = { name: 'menu', svg: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>' };
export const argIconPlus: ArgIconDef = { name: 'plus', svg: '<path d="M12 5v14M5 12h14"/>' };
export const argIconX: ArgIconDef = { name: 'x', svg: '<path d="M6 6l12 12M18 6L6 18"/>' };

/** Todos os ícones. Prefira registrar só os que o produto usa. */
export const argIconsAll: readonly ArgIconDef[] = [argIconAlertCircle, argIconAlertTriangle, argIconCheck, argIconCheckCircle, argIconExternalLink, argIconInfo, argIconMenu, argIconPlus, argIconX];
