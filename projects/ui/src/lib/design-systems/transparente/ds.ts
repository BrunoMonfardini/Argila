import type { ArgDesignSystem } from '../design-system';

/** Transparente: vidro espesso, translúcido, com aro claro e brilho. */
export const transparente = {
  id: 'transparente',
  nome: 'Transparente',
  linguagem:
    'Vidro espesso: superfícies translúcidas com desfoque, aro claro, brilho no topo e borda iridescente.',
  referencia: 'transparente.jpg',
  modos: ['light', 'dark'],
  transparencia: true,
  fundos: ['liso', 'degrade', 'imagem'],
  paletas: ['nativa', 'oceano', 'terrosa', 'mono'],
  componentes: {
    nucleoMinimo: true,
    curados: ['combobox', 'drawer', 'menu', 'popover'],
    fora: [],
  },
  exclusivos: [],
  regras: [
    'Vidro sempre sobre fundo com conteúdo ou textura: sobre branco liso ele some',
    'No máximo um botão colorido por grupo',
    'Texto nunca diretamente sobre a borda iridescente',
  ],
} as const satisfies ArgDesignSystem;
