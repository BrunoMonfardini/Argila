import type { ArgDesignSystem } from './design-systems.ts';

/**
 * Comparação de um design system com a imagem de referência dele: a página
 * do DS no catálogo, em cada modo, ao lado da imagem. A parte pura do
 * `scripts/comparar-referencia.ts`, testável sem o Chrome.
 */

export interface ComparisonShot {
  /** "Claro", "Escuro" ou o nome da página. */
  label: string;
  /** Caminho da captura, relativo ao HTML. */
  file: string;
}

export interface Comparison {
  name: string;
  /** Caminho da imagem de referência, relativo ao HTML. */
  reference: string;
  shots: ComparisonShot[];
}

const MODE_LABELS = { light: 'Claro', dark: 'Escuro' } as const;

/** Os DS com imagem de referência, só os pedidos (ou todos); um id desconhecido é erro. */
export function comparisonTargets(
  designSystems: readonly ArgDesignSystem[],
  only?: readonly string[],
): ArgDesignSystem[] {
  const unknown = (only ?? []).filter((id) => !designSystems.some((ds) => ds.id === id));
  if (unknown.length) throw new Error(`design system desconhecido: ${unknown.join(', ')}`);
  return designSystems.filter((ds) => ds.referencia && (!only || only.includes(ds.id)));
}

/** O endereço da página do DS no catálogo, já no DS e no modo pedidos. */
export function comparisonUrl(base: string, ds: ArgDesignSystem, mode: 'light' | 'dark'): string {
  return `${base.replace(/\/$/, '')}/design-systems/${ds.id}?ds=${ds.id}&modo=${mode}`;
}

/** O nome do arquivo e o rótulo de cada captura, um por modo do DS. */
export function comparisonShots(
  ds: ArgDesignSystem,
): (ComparisonShot & { mode: 'light' | 'dark' })[] {
  return ds.modos.map((mode) => ({ mode, label: MODE_LABELS[mode], file: `${ds.id}-${mode}.png` }));
}

const escape = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!,
  );

/** A página da comparação: a referência à esquerda e as capturas ao lado, na mesma largura. */
export function comparisonHtml(comparison: Comparison): string {
  const column = (label: string, file: string) =>
    `<figure><figcaption>${escape(label)}</figcaption><img src="${escape(file)}" alt="${escape(label)}"></figure>`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${escape(comparison.name)}: comparação com a referência</title>
<style>
  body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #f4f4f4; color: #222; }
  h1 { margin: 0 0 16px; font-size: 20px; }
  .grade { display: grid; grid-template-columns: repeat(${comparison.shots.length + 1}, minmax(0, 1fr)); gap: 16px; align-items: start; }
  figure { margin: 0; }
  figcaption { margin-bottom: 8px; font-weight: 600; }
  img { width: 100%; border: 1px solid #ccc; background: #fff; }
</style>
</head>
<body>
<h1>${escape(comparison.name)}: referência × catálogo</h1>
<div class="grade">
${[column('Referência', comparison.reference), ...comparison.shots.map((shot) => column(shot.label, shot.file))].join('\n')}
</div>
</body>
</html>
`;
}
