import {
  ARG_BRAND_ROLES,
  ArgBackgroundName,
  ArgColorScheme,
  ArgColors,
  ArgPalette,
  ArgSegment,
  ArgStyle,
  argSegmentAttributes,
} from '@brunomonfardini/ui';

/** O que a barra de tema escolheu agora: o mesmo estado do `ArgTheme`. */
export interface ThemeChoice {
  style: ArgStyle;
  palette: ArgPalette;
  /** Paleta padrão do design system: não precisa ir no segmento. */
  defaultPalette: ArgPalette;
  scheme: ArgColorScheme;
  colors: ArgColors;
  surfaceOpacity: number | undefined;
  background: ArgBackgroundName;
  /** Fundo padrão do design system: não precisa ir no segmento. */
  defaultBackground: ArgBackgroundName;
}

/** O segmento que reproduz a escolha; campos que valem por padrão ficam de fora. */
export function segmentOf(choice: ThemeChoice): ArgSegment {
  const segment: Record<string, unknown> = { style: choice.style };
  if (choice.palette !== choice.defaultPalette) segment['palette'] = choice.palette;
  segment['scheme'] = choice.scheme;
  const colors = Object.fromEntries(
    ARG_BRAND_ROLES.flatMap((role) => (choice.colors[role] ? [[role, choice.colors[role]]] : [])),
  );
  if (Object.keys(colors).length) segment['colors'] = colors;
  if (choice.surfaceOpacity !== undefined) segment['surfaceOpacity'] = choice.surfaceOpacity;
  if (choice.background !== choice.defaultBackground) segment['background'] = choice.background;
  return segment as ArgSegment;
}

function literal(value: unknown): string {
  if (typeof value === 'string') return `'${value}'`;
  if (typeof value === 'object' && value) {
    return `{ ${Object.entries(value)
      .map(([key, item]) => `${key}: ${literal(item)}`)
      .join(', ')} }`;
  }
  return String(value);
}

/** O `provideArgila` com o segmento, pronto para o `app.config.ts`. */
export function segmentCode(segment: ArgSegment, name = 'meuSegmento'): string {
  const fields = Object.entries(segment)
    .map(([key, value]) => `        ${key}: ${literal(value)},`)
    .join('\n');
  return `provideArgila({
  segments: {
    ${name}: {
${fields.replace(/^ {8}/gm, '      ')}
    },
  },
  defaultSegment: '${name}',
})`;
}

/** O `<html>` com os atributos do segmento, para quem não usa Angular. */
export function htmlCode(segment: ArgSegment): string {
  const attributes = Object.entries(argSegmentAttributes(segment))
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');
  const html = `<html ${attributes}>`;
  if (segment.surfaceOpacity === undefined) return html;
  return `${html}\n\n<!-- No CSS do produto -->\n<style>\n  :root {\n    --arg-surface-opacity: ${segment.surfaceOpacity};\n  }\n</style>`;
}
