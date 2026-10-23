import {
  ARG_BRAND_ROLES,
  ArgBackgroundName,
  ArgColorScheme,
  ArgColors,
  ArgPalette,
  ArgSegment,
  ArgStyle,
  argSegmentAttributes,
  argSegmentStyles,
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
  /** Imagem do fundo `imagem` no catálogo; no código, vira o caminho no produto. */
  backgroundImage?: string;
  backgroundVeil?: number;
  backgroundMotion?: boolean;
}

/** Onde a imagem do fundo fica no produto: o catálogo não sabe, então sugere este caminho. */
export const PRODUCT_BACKGROUND_IMAGE = 'assets/fundo.jpg';

/** Comentários do código copiado, nos campos que dependem da imagem do produto. */
const FIELD_COMMENTS: Partial<Record<string, string>> = {
  backgroundImage: 'Troque pelo caminho da sua imagem',
  backgroundVeil: 'Calculado para a imagem enviada; com outra imagem, calcule de novo',
};

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
  if (choice.background === 'imagem' && choice.backgroundImage) {
    segment['backgroundImage'] = PRODUCT_BACKGROUND_IMAGE;
    if (choice.backgroundVeil !== undefined) segment['backgroundVeil'] = choice.backgroundVeil;
  }
  if (choice.backgroundMotion) segment['backgroundMotion'] = true;
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
    .map(([key, value]) => {
      const comment = FIELD_COMMENTS[key];
      const line = `        ${key}: ${literal(value)},`;
      return comment ? `        // ${comment}\n${line}` : line;
    })
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
  const styles = Object.entries(argSegmentStyles(segment))
    .map(([name, value]) => `    ${name}: ${value};`)
    .join('\n');
  if (!styles) return html;
  return `${html}\n\n<!-- No CSS do produto -->\n<style>\n  :root {\n${styles}\n  }\n</style>`;
}
