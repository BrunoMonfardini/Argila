/**
 * Cores de marca: o CSS de cada cor em cada papel e a lista do que cada
 * design system × paleta aceita, calculada com os mesmos pares do teste de
 * contraste. O script `scripts/gerar-cores.ts` só grava (ou confere) o resultado.
 */
import type {
  ArgBrandColorInfo,
  ArgBrandRole,
} from '../../projects/ui/src/lib/design-systems/colors.ts';
import {
  type ColorScheme,
  type ContrastPair,
  type TokenBlocks,
  checkContrast,
  contrastFailures,
  parseTokenBlocks,
  tokensForRoot,
} from './contraste.ts';
import { rootAttributes } from './design-systems.ts';

/** O que o gerador precisa de cada manifesto. */
export interface DesignSystemPalettes {
  id: string;
  paletas: readonly string[];
  modos: readonly ColorScheme[];
}

/** Matriz gerada: design system → paleta → papel → cores permitidas. */
export type AllowedColors = Record<string, Record<string, Record<ArgBrandRole, string[]>>>;

const HEADER = `/*
 * Gerado por scripts/gerar-cores.ts a partir de ARG_BRAND_COLORS
 * (src/lib/design-systems/colors.ts). Não edite: rode \`pnpm colors\`.
 *
 * Cada cor vale num papel pelo atributo no <html>: data-arg-primary,
 * data-arg-secondary ou data-arg-accent. O atributo repetido no seletor dá a
 * mesma força das paletas nativas (0,3,0); este arquivo vem por último no
 * temas.css, então a cor de marca vence a paleta.
 */`;

/** CSS de todas as cores em todos os papéis. */
export function colorsCss(
  colors: Record<string, ArgBrandColorInfo>,
  roles: readonly ArgBrandRole[],
): string {
  const rules = Object.entries(colors).flatMap(([id, color]) =>
    roles.map((role) => {
      const value = `light-dark(${color.claro}, ${color.escuro})`;
      const lines = [
        `:root[data-arg-${role}][data-arg-${role}='${id}'] {`,
        `  --arg-color-${role}: ${value};`,
        `  --arg-color-on-${role}: light-dark(${color.sobreClaro}, ${color.sobreEscuro});`,
      ];
      if (role === 'primary') {
        // O preenchimento suave acompanha a marca: a cor clareada sobre a superfície
        lines.push(
          `  --arg-color-primary-soft: color-mix(in oklab, ${value} 28%, var(--arg-color-surface-solid));`,
          '  --arg-color-on-primary-soft: var(--arg-color-text);',
        );
      }
      lines.push('}');
      return lines.join('\n');
    }),
  );
  return `${HEADER}\n${rules.join('\n\n')}\n`;
}

/** Transparência mínima das superfícies: o pior caso para o texto sobre elas. */
const MIN_OPACITY = '0.4';

/**
 * Para cada design system, paleta aceita e papel, as cores com as quais todos
 * os pares passam (os da paleta: `pairsFor`), em cada modo do design system e
 * com as superfícies na opacidade mínima.
 */
export function allowedColors(
  files: readonly TokenBlocks[],
  css: string,
  designSystems: readonly DesignSystemPalettes[],
  colors: readonly string[],
  roles: readonly ArgBrandRole[],
  pairsFor: (palette: string) => readonly ContrastPair[],
): AllowedColors {
  const all = [...files, parseTokenBlocks(css)];
  const matrix: AllowedColors = {};
  for (const ds of designSystems) {
    matrix[ds.id] = {};
    for (const palette of ds.paletas) {
      const byRole = {} as Record<ArgBrandRole, string[]>;
      const pairs = [...pairsFor(palette)];
      for (const role of roles) {
        byRole[role] = colors.filter((color) => {
          const tokens = tokensForRoot(all, {
            ...rootAttributes(ds.id, palette),
            [`data-arg-${role}`]: color,
          });
          const translucent = new Map(tokens).set('--arg-surface-opacity', MIN_OPACITY);
          return ds.modos.every(
            (scheme) =>
              contrastFailures(checkContrast(tokens, pairs, scheme)).length === 0 &&
              contrastFailures(checkContrast(translucent, pairs, scheme)).length === 0,
          );
        });
      }
      matrix[ds.id][palette] = byRole;
    }
  }
  return matrix;
}

/** O módulo TypeScript com a matriz, para o `ArgTheme` e os tipos. */
export function allowedColorsModule(matrix: AllowedColors): string {
  return `// Gerado por scripts/gerar-cores.ts: as cores de marca que passam no contraste em
// cada design system × paleta. Não edite: rode \`pnpm colors\`.
import type { ArgBrandColor, ArgBrandRole } from './colors';

export const ARG_ALLOWED_COLORS: Readonly<
  Record<string, Readonly<Record<string, Readonly<Record<ArgBrandRole, readonly ArgBrandColor[]>>>>>
> = ${JSON.stringify(matrix, null, 2)};
`;
}
