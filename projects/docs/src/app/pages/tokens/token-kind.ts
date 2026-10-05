/** Como desenhar a amostra de um token, pelo nome. */
export type TokenKind = 'color' | 'space' | 'radius' | 'shadow' | 'font-size' | 'other';

export function tokenKind(name: string): TokenKind {
  if (
    name.startsWith('--arg-color-') ||
    /^--arg-(shadow-color|loading-(bg|highlight))$/.test(name)
  ) {
    return 'color';
  }
  if (name.startsWith('--arg-space-')) return 'space';
  if (name.startsWith('--arg-radius-')) return 'radius';
  if (/^--arg-shadow-(sm|md|lg)$/.test(name)) return 'shadow';
  if (name.startsWith('--arg-font-size-')) return 'font-size';
  return 'other';
}

/** Propriedade CSS usada para calcular o valor atual do token num elemento de prova. */
const PROBE_PROPERTY: Partial<Record<TokenKind, string>> = {
  color: 'background-color',
  space: 'width',
  radius: 'border-top-left-radius',
  shadow: 'box-shadow',
  'font-size': 'font-size',
};

/**
 * Valor que o navegador calcula para o token agora, no tema atual. Cores com
 * `light-dark()` e `color-mix()` só viram uma cor de verdade quando aplicadas.
 */
export function computedTokenValue(name: string, root: HTMLElement): string {
  const property = PROBE_PROPERTY[tokenKind(name)];
  if (!property) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }
  const probe = root.ownerDocument.createElement('span');
  probe.style.setProperty('position', 'absolute');
  probe.style.setProperty('visibility', 'hidden');
  probe.style.setProperty(property, `var(${name})`);
  root.ownerDocument.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property).trim();
  probe.remove();
  return value;
}
