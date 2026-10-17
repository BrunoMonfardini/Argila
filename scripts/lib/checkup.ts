/// <reference lib="dom" />
// A auditoria roda dentro da página: precisa dos tipos do navegador.
/**
 * Checkup visual do catálogo: as combinações de tema a percorrer, a auditoria
 * que roda dentro de cada página no navegador e o relatório em HTML.
 * O script `scripts/checkup-visual.ts` só pilota o Chrome com estas peças.
 */

export type Scheme = 'light' | 'dark';

export interface Combination {
  style: string;
  palette: string;
  scheme: Scheme;
}

/** Estilos e os modos de cada um, lidos de `ARG_STYLES` no código do `ArgTheme`. */
export function styleSchemes(source: string): Record<string, Scheme[]> {
  const body = /export const ARG_STYLES\b[^=]*=\s*\{([\s\S]*?)\n\};/.exec(source);
  if (!body) throw new Error('ARG_STYLES não encontrado');
  const styles: Record<string, Scheme[]> = {};
  for (const [, name, schemes] of body[1].matchAll(
    /^\s*'?([\w-]+)'?\s*:\s*\{\s*schemes:\s*\[([^\]]*)\]/gm,
  )) {
    styles[name] = [...schemes.matchAll(/'(light|dark)'/g)].map((match) => match[1] as Scheme);
  }
  return styles;
}

/** Toda combinação de estilo × paleta × modo suportado pelo estilo. */
export function combinations(
  styles: Record<string, readonly Scheme[]>,
  palettes: readonly string[],
): Combination[] {
  return Object.entries(styles).flatMap(([style, schemes]) =>
    palettes.flatMap((palette) => schemes.map((scheme) => ({ style, palette, scheme }))),
  );
}

export function combinationName({ style, palette, scheme }: Combination): string {
  return `${style}-${palette}-${scheme === 'light' ? 'claro' : 'escuro'}`;
}

/** Caminho da página como nome de arquivo: "/componentes/button" → "componentes-button". */
export function pageFile(path: string): string {
  return path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'inicio';
}

export interface LowContrast {
  element: string;
  text: string;
  ratio: number;
  minimum: number;
  color: string;
  background: string;
}

export interface Audit {
  /** Pixels de rolagem horizontal da página (0 quando cabe na largura). */
  overflow: number;
  lowContrast: LowContrast[];
}

/**
 * Roda DENTRO da página (é enviada como texto ao navegador): não pode usar
 * nada de fora da própria função. Mede a rolagem horizontal e o contraste do
 * texto visível contra o fundo efetivo (camadas translúcidas compostas).
 */
export function auditPage(): Audit {
  interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
  }
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  let context: CanvasRenderingContext2D | null = null;
  try {
    context = canvas.getContext('2d', { willReadFrequently: true });
  } catch {
    context = null;
  }

  // O navegador devolve cores em vários formatos (rgb, oklab, color()); o canvas normaliza
  const toRgba = (value: string): Rgba | null => {
    if (context) {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = '#000';
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    }
    const match = /rgba?\(([^)]+)\)/.exec(value);
    if (!match) return null;
    const [r, g, b, a = 1] = match[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return { r, g, b, a };
  };
  const over = (top: Rgba, base: Rgba): Rgba => ({
    r: top.r * top.a + base.r * (1 - top.a),
    g: top.g * top.a + base.g * (1 - top.a),
    b: top.b * top.a + base.b * (1 - top.a),
    a: 1,
  });
  const luminance = ({ r, g, b }: Rgba) => {
    const [lr, lg, lb] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  };
  const ratio = (a: Rgba, b: Rgba) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
  };
  const hex = ({ r, g, b }: Rgba) =>
    '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');

  /** Fundo efetivo: compõe os fundos dos ancestrais até achar um opaco (ou branco). */
  const backgroundOf = (element: Element): Rgba | null => {
    const layers: Rgba[] = [];
    for (let node: Element | null = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage && style.backgroundImage !== 'none') return null;
      const color = toRgba(style.backgroundColor);
      if (color && color.a > 0) layers.push(color);
      if (color && color.a >= 1) break;
    }
    let result: Rgba = { r: 255, g: 255, b: 255, a: 1 };
    for (const layer of layers.reverse()) result = over(layer, result);
    return result;
  };

  const lowContrast: LowContrast[] = [];
  const seen = new Set<string>();
  for (const element of Array.from(document.body.querySelectorAll('*'))) {
    const text = Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent ?? '')
      .join('')
      .trim();
    if (!text || !(element instanceof HTMLElement)) continue;
    if (element.closest(':disabled, [aria-disabled="true"], [aria-hidden="true"], [hidden]')) {
      continue;
    }
    // Rótulo de um controle desabilitado: inativo, isento de contraste (WCAG 1.4.3)
    if (element.closest('label')?.control?.matches(':disabled')) continue;
    // checkVisibility() é do navegador; o jsdom dos testes não tem layout e considera visível
    const visible =
      typeof element.checkVisibility !== 'function' ||
      element.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    if (!visible) continue;
    const style = getComputedStyle(element);
    // Texto só para leitor de tela (arg-sr-only): recortado em 1px, ninguém vê
    const clipped =
      style.overflow === 'hidden' &&
      Number.parseFloat(style.width) <= 1 &&
      Number.parseFloat(style.height) <= 1;
    if (clipped) continue;
    const background = backgroundOf(element);
    const foreground = toRgba(style.color);
    if (!background || !foreground) continue;
    const color = over(foreground, background);
    const size = Number.parseFloat(style.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
    const minimum = large ? 3 : 4.5;
    const value = Math.floor(ratio(color, background) * 100) / 100;
    if (value >= minimum) continue;
    const classes = Array.from(element.classList).slice(0, 2).join('.');
    const entry: LowContrast = {
      element: element.tagName.toLowerCase() + (classes ? `.${classes}` : ''),
      text: text.slice(0, 40),
      ratio: value,
      minimum,
      color: hex(color),
      background: hex(background),
    };
    const key = `${entry.element}|${entry.color}|${entry.background}`;
    if (seen.has(key)) continue;
    seen.add(key);
    lowContrast.push(entry);
  }
  return {
    overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    lowContrast,
  };
}

export type IssueKind = 'erro' | 'rolagem' | 'contraste' | 'barra de tema';

export interface Issue {
  page: string;
  combination: string;
  kind: IssueKind;
  detail: string;
}

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!,
  );

/**
 * Relatório: os problemas encontrados e uma grade com a captura de cada
 * página (linhas) em cada combinação (colunas), para comparar lado a lado.
 */
export function reportHtml(
  pages: readonly string[],
  combos: readonly Combination[],
  issues: readonly Issue[],
): string {
  const names = combos.map(combinationName);
  const issueRows = issues
    .map(
      (issue) =>
        `<tr><td>${escapeHtml(issue.kind)}</td><td>${escapeHtml(issue.page)}</td><td>${escapeHtml(issue.combination)}</td><td>${escapeHtml(issue.detail)}</td></tr>`,
    )
    .join('\n');
  const gridRows = pages
    .map((page) => {
      const cells = names
        .map((name) => {
          const src = `${name}/${pageFile(page)}.png`;
          return `<td><a href="${src}"><img loading="lazy" src="${src}" alt="${escapeHtml(page)} em ${name}"></a></td>`;
        })
        .join('');
      return `<tr><th scope="row">${escapeHtml(page)}</th>${cells}</tr>`;
    })
    .join('\n');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Checkup visual · Argila</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; color: #1e1b19; background: #faf9f7; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid #ddd; padding: 4px 8px; text-align: left; vertical-align: top; font-size: 13px; }
  .grade { overflow: auto; }
  .grade img { width: 220px; display: block; }
  .grade thead th { position: sticky; top: 0; background: #faf9f7; }
</style>
</head>
<body>
<h1>Checkup visual</h1>
<p>${pages.length} página(s) × ${combos.length} combinação(ões); ${issues.length} problema(s).</p>
<h2>Problemas</h2>
${issues.length ? `<table><thead><tr><th>Tipo</th><th>Página</th><th>Combinação</th><th>Detalhe</th></tr></thead><tbody>\n${issueRows}\n</tbody></table>` : '<p>Nenhum.</p>'}
<h2>Capturas</h2>
<div class="grade"><table>
<thead><tr><th>Página</th>${names.map((name) => `<th>${name}</th>`).join('')}</tr></thead>
<tbody>
${gridRows}
</tbody></table></div>
</body>
</html>
`;
}
