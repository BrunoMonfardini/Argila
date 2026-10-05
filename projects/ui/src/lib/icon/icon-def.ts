import type { ArgIconName } from './icons.generated';

/** Um ícone do Argila: o nome e o desenho (o conteúdo do `<svg>`, sem a raiz). */
export interface ArgIconDef {
  readonly name: ArgIconName;
  readonly svg: string;
}
