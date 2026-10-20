import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  ARG_CARD,
  ARG_CHOICE,
  ARG_INPUT_GROUP,
  ARG_TABLE,
  ARG_TABS,
  ArgAlert,
  ArgAvatar,
  ArgBadge,
  ArgButton,
  ArgEmptyState,
  ArgIcon,
  ArgIconButton,
  ArgInput,
  ArgPagination,
  ArgProgressBar,
  ArgSelect,
  ArgStepper,
  ArgStyle,
  ArgTableColumn,
  ArgTag,
} from '@brunomonfardini/ui';

/** As seções que uma folha de estilo pode ter, como nas imagens de referência. */
export type StyleSheetSection =
  | 'cores'
  | 'tipografia'
  | 'espacamento'
  | 'raio'
  | 'elevacao'
  | 'botoes'
  | 'campos'
  | 'chips'
  | 'abas'
  | 'alertas'
  | 'cards'
  | 'controles'
  | 'passos'
  | 'paginacao'
  | 'selos'
  | 'avatares'
  | 'tabela'
  | 'progresso'
  | 'vazio';

/** A ordem da referência do Argila ("Product UI Styleguide"), a padrão. */
export const DEFAULT_SECTIONS: readonly StyleSheetSection[] = [
  'cores',
  'tipografia',
  'espacamento',
  'raio',
  'elevacao',
  'botoes',
  'campos',
  'chips',
  'abas',
  'alertas',
  'cards',
];

/**
 * A ordem das seções de cada DS, como na imagem de referência dele. Os itens
 * de cada DS no plano das referências ajustam esta tabela.
 */
export const STYLE_SHEET_SECTIONS: Partial<Record<ArgStyle, readonly StyleSheetSection[]>> = {
  // "Neo-Brutalist Design System": Foundations, Components, Data display e Feedback
  'neo-brutalista': [
    'cores',
    'tipografia',
    'espacamento',
    'elevacao',
    'botoes',
    'campos',
    'controles',
    'abas',
    'passos',
    'paginacao',
    'cards',
    'selos',
    'avatares',
    'tabela',
    'alertas',
    'progresso',
    'vazio',
  ],
};

export const SECTION_TITLES: Record<StyleSheetSection, string> = {
  cores: 'Cores',
  tipografia: 'Tipografia',
  espacamento: 'Espaçamento',
  raio: 'Raio',
  elevacao: 'Elevação',
  botoes: 'Botões',
  campos: 'Campos',
  chips: 'Chips',
  abas: 'Abas',
  alertas: 'Alertas',
  cards: 'Cards',
  controles: 'Controles',
  passos: 'Passos',
  paginacao: 'Paginação',
  selos: 'Selos',
  avatares: 'Avatares',
  tabela: 'Tabela',
  progresso: 'Progresso',
  vazio: 'Estado vazio',
};

export const SWATCHES = [
  { token: '--arg-color-primary-soft', label: 'Primária' },
  { token: '--arg-color-primary', label: 'Primária forte' },
  { token: '--arg-color-secondary', label: 'Secundária' },
  { token: '--arg-color-accent', label: 'Destaque' },
  { token: '--arg-color-surface-solid', label: 'Superfície' },
  { token: '--arg-color-background', label: 'Fundo' },
  { token: '--arg-color-border', label: 'Borda' },
  { token: '--arg-color-focus', label: 'Anel de foco' },
  // Os blocos de feedback (alertas, selos), que são as cores das referências
  { token: '--arg-color-success-soft', label: 'Sucesso' },
  { token: '--arg-color-warning-soft', label: 'Aviso' },
  { token: '--arg-color-danger-soft', label: 'Erro' },
  { token: '--arg-color-info-soft', label: 'Informação' },
];

export const TYPE_SCALE = [
  { token: '--arg-font-size-display', label: 'Display', heading: true },
  { token: '--arg-font-size-heading-lg', label: 'Título 1', heading: true },
  { token: '--arg-font-size-heading-md', label: 'Título 2', heading: true },
  { token: '--arg-font-size-heading-sm', label: 'Título 3', heading: true },
  { token: '--arg-font-size-body', label: 'Corpo', heading: false },
  { token: '--arg-font-size-caption', label: 'Legenda', heading: false },
];

const SPACES = ['1', '2', '3', '4', '6', '8'].map((step) => `--arg-space-${step}`);
const RADII = [
  { token: '--arg-radius-control', label: 'Controles' },
  { token: '--arg-radius-container', label: 'Contêineres' },
];

/**
 * A folha de estilo de um design system: as mesmas seções da imagem de
 * referência dele, montadas com os componentes de verdade. Vale para o DS
 * aplicado ao catálogo; a comparação com a referência (`npm run comparar`)
 * fotografa esta folha.
 */
@Component({
  selector: 'doc-style-sheet',
  imports: [
    ARG_CARD,
    ARG_CHOICE,
    ARG_INPUT_GROUP,
    ARG_TABLE,
    ARG_TABS,
    ArgAlert,
    ArgAvatar,
    ArgBadge,
    ArgButton,
    ArgEmptyState,
    ArgIcon,
    ArgIconButton,
    ArgInput,
    ArgPagination,
    ArgProgressBar,
    ArgSelect,
    ArgStepper,
    ArgTag,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './style-sheet.html',
  styleUrl: './style-sheet.css',
})
export class DocStyleSheet {
  /** O design system da folha: define a ordem das seções. */
  readonly style = input.required<ArgStyle>();

  protected readonly titles = SECTION_TITLES;
  protected readonly swatches = SWATCHES;
  protected readonly typeScale = TYPE_SCALE;
  protected readonly spaces = SPACES;
  protected readonly radii = RADII;
  protected readonly levels = [1, 2, 3, 4, 5];
  protected readonly columns: ArgTableColumn[] = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'servico', label: 'Serviço' },
    { key: 'valor', label: 'Valor', align: 'end' },
  ];
  protected readonly rows = [
    { nome: 'Thor', servico: 'Banho', valor: 'R$ 60,00' },
    { nome: 'Mel', servico: 'Tosa', valor: 'R$ 35,00' },
  ];
  protected readonly sections = computed(
    () => STYLE_SHEET_SECTIONS[this.style()] ?? DEFAULT_SECTIONS,
  );

  protected id(section: StyleSheetSection): string {
    return `folha-${section}`;
  }
}
