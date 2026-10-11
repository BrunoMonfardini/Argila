export type ArgSide = 'top' | 'bottom' | 'left' | 'right';
export type ArgAlign = 'start' | 'center' | 'end';

/** Distância do gatilho e da borda da tela, em px (igual a --arg-space-2). */
const GAP = 8;

/** Janela com o `CSS.supports` opcional: o jsdom dos testes não tem. */
interface WithCss {
  CSS?: { supports?: (condition: string) => boolean };
}

/** Verdadeiro quando o navegador posiciona sozinho por anchor CSS (ou quando não dá para saber). */
export function supportsAnchor(view: Window | null): boolean {
  return (view as WithCss | null)?.CSS?.supports?.('position-area: top') !== false;
}

/**
 * Posiciona `panel` (com `position: fixed`) ao lado de `trigger`, para
 * navegadores sem anchor CSS. Troca para o lado oposto quando falta espaço e
 * nunca deixa o painel sair da tela.
 */
export function placeBeside(
  trigger: HTMLElement,
  panel: HTMLElement,
  side: ArgSide,
  align: ArgAlign = 'center',
): void {
  const view = trigger.ownerDocument.defaultView;
  if (!view) return;
  const anchor = trigger.getBoundingClientRect();
  const box = panel.getBoundingClientRect();
  const width = view.innerWidth;
  const height = view.innerHeight;

  // Lado oposto quando o pedido não cabe e o outro cabe
  const fits: Record<ArgSide, boolean> = {
    top: anchor.top - box.height - GAP >= 0,
    bottom: anchor.bottom + box.height + GAP <= height,
    left: anchor.left - box.width - GAP >= 0,
    right: anchor.right + box.width + GAP <= width,
  };
  const opposite: Record<ArgSide, ArgSide> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  const chosen = !fits[side] && fits[opposite[side]] ? opposite[side] : side;

  const alongX = {
    start: anchor.left,
    center: anchor.left + (anchor.width - box.width) / 2,
    end: anchor.right - box.width,
  }[align];
  const alongY = {
    start: anchor.top,
    center: anchor.top + (anchor.height - box.height) / 2,
    end: anchor.bottom - box.height,
  }[align];
  const spots: Record<ArgSide, [number, number]> = {
    top: [alongX, anchor.top - box.height - GAP],
    bottom: [alongX, anchor.bottom + GAP],
    left: [anchor.left - box.width - GAP, alongY],
    right: [anchor.right + GAP, alongY],
  };
  const [left, top] = spots[chosen];
  const clamp = (value: number, size: number, limit: number) =>
    Math.max(GAP, Math.min(value, limit - size - GAP));
  panel.style.left = `${clamp(left, box.width, width)}px`;
  panel.style.top = `${clamp(top, box.height, height)}px`;
}
