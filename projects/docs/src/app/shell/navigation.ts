export interface DocNavLink {
  label: string;
  path: string;
  /** Texto usado também na busca da barra lateral. */
  summary?: string;
}

export interface DocNavSection {
  title: string;
  links: DocNavLink[];
}

/** Seções da barra lateral, na ordem em que aparecem. */
export function buildNavigation(): DocNavSection[] {
  return [{ title: 'Começo', links: [{ label: 'Início', path: '/' }] }];
}
