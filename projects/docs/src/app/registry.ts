import { InjectionToken } from '@angular/core';
import { AGENDA_DOCS } from '../../../ui/src/lib/agenda/agenda.docs';
import { ALERT_DOCS } from '../../../ui/src/lib/alert/alert.docs';
import { APP_SHELL_DOCS } from '../../../ui/src/lib/app-shell/app-shell.docs';
import { AVATAR_DOCS } from '../../../ui/src/lib/avatar/avatar.docs';
import { BADGE_DOCS } from '../../../ui/src/lib/badge/badge.docs';
import { BREADCRUMB_DOCS } from '../../../ui/src/lib/breadcrumb/breadcrumb.docs';
import { BUTTON_DOCS } from '../../../ui/src/lib/button/button.docs';
import { CARD_DOCS } from '../../../ui/src/lib/card/card.docs';
import { CHOICE_DOCS } from '../../../ui/src/lib/choice/choice.docs';
import { COMBOBOX_DOCS } from '../../../ui/src/lib/combobox/combobox.docs';
import { CURRENCY_INPUT_DOCS } from '../../../ui/src/lib/currency-input/currency-input.docs';
import { DATE_PICKER_DOCS } from '../../../ui/src/lib/date-picker/date-picker.docs';
import { DIALOG_DOCS } from '../../../ui/src/lib/dialog/dialog.docs';
import { DIVIDER_DOCS } from '../../../ui/src/lib/divider/divider.docs';
import { DRAWER_DOCS } from '../../../ui/src/lib/drawer/drawer.docs';
import { EMPTY_STATE_DOCS } from '../../../ui/src/lib/empty-state/empty-state.docs';
import { FIELD_DOCS } from '../../../ui/src/lib/field/field.docs';
import { FILE_UPLOAD_DOCS } from '../../../ui/src/lib/file-upload/file-upload.docs';
import { ICON_DOCS } from '../../../ui/src/lib/icon/icon.docs';
import { ICON_BUTTON_DOCS } from '../../../ui/src/lib/icon-button/icon-button.docs';
import { INPUT_DOCS } from '../../../ui/src/lib/input/input.docs';
import { LINK_DOCS } from '../../../ui/src/lib/link/link.docs';
import { LIST_DOCS } from '../../../ui/src/lib/list/list.docs';
import { MASKED_INPUT_DOCS } from '../../../ui/src/lib/masked-input/masked-input.docs';
import { MENU_DOCS } from '../../../ui/src/lib/menu/menu.docs';
import { PAGINATION_DOCS } from '../../../ui/src/lib/pagination/pagination.docs';
import { POPOVER_DOCS } from '../../../ui/src/lib/popover/popover.docs';
import { PROGRESS_BAR_DOCS } from '../../../ui/src/lib/progress-bar/progress-bar.docs';
import { SELECT_DOCS } from '../../../ui/src/lib/select/select.docs';
import { SKELETON_DOCS } from '../../../ui/src/lib/skeleton/skeleton.docs';
import { SPINNER_DOCS } from '../../../ui/src/lib/spinner/spinner.docs';
import { STEPPER_DOCS } from '../../../ui/src/lib/stepper/stepper.docs';
import { TABLE_DOCS } from '../../../ui/src/lib/table/table.docs';
import { TABS_DOCS } from '../../../ui/src/lib/tabs/tabs.docs';
import { TAG_DOCS } from '../../../ui/src/lib/tag/tag.docs';
import { TIME_SLOTS_DOCS } from '../../../ui/src/lib/time-slots/time-slots.docs';
import { TOAST_DOCS } from '../../../ui/src/lib/toast/toast.docs';
import { TOOLTIP_DOCS } from '../../../ui/src/lib/tooltip/tooltip.docs';
import { LIST_LOADING_DOCS } from '../../../ui/src/patterns/loading.docs';
import { ABOUT_DESIGN_SYSTEMS_DOCS } from '../../../ui/src/docs/pages/about-design-systems.docs';
import { ABOUT_TEMPLATES_DOCS } from '../../../ui/src/docs/pages/about-templates.docs';
import { ACCESSIBILITY_DOCS } from '../../../ui/src/docs/pages/accessibility.docs';
import { GETTING_STARTED_DOCS } from '../../../ui/src/docs/pages/getting-started.docs';
import { HELP_DOCS } from '../../../ui/src/docs/pages/help.docs';
import { NB_STICKER_DOCS } from '../../../ui/src/lib/design-systems/neo-brutalista/exclusivos/nb-sticker/nb-sticker.docs';
import { NB_RULES_DOCS } from '../../../ui/src/lib/design-systems/neo-brutalista/exclusivos/nb-rules/nb-rules.docs';
import { PUNK_STAT_CARD_DOCS } from '../../../ui/src/lib/design-systems/punk/exclusivos/punk-stat-card/punk-stat-card.docs';
import { PUNK_DOT_TRACK_DOCS } from '../../../ui/src/lib/design-systems/punk/exclusivos/punk-dot-track/punk-dot-track.docs';
import { PUNK_BURST_DOCS } from '../../../ui/src/lib/design-systems/punk/exclusivos/punk-burst/punk-burst.docs';
import { XP_WINDOW_DOCS } from '../../../ui/src/lib/design-systems/windows-xp/exclusivos/xp-window/xp-window.docs';
import { XP_BALLOON_DOCS } from '../../../ui/src/lib/design-systems/windows-xp/exclusivos/xp-balloon/xp-balloon.docs';
import type { DocCategory, DocPage } from '../../../ui/src/docs/doc-page';

export type { DocCategory, DocExample, DocPage } from '../../../ui/src/docs/doc-page';

/**
 * Todas as páginas do catálogo. Componente novo: crie o `<componente>.docs.ts`
 * e acrescente aqui. O CI confere que nenhum componente exportado ficou de fora.
 */
export const ALL_DOC_PAGES: readonly DocPage[] = [
  GETTING_STARTED_DOCS,
  ACCESSIBILITY_DOCS,
  HELP_DOCS,
  ABOUT_DESIGN_SYSTEMS_DOCS,
  ABOUT_TEMPLATES_DOCS,
  XP_BALLOON_DOCS,
  XP_WINDOW_DOCS,
  PUNK_BURST_DOCS,
  PUNK_DOT_TRACK_DOCS,
  PUNK_STAT_CARD_DOCS,
  NB_RULES_DOCS,
  NB_STICKER_DOCS,
  AGENDA_DOCS,
  ALERT_DOCS,
  APP_SHELL_DOCS,
  AVATAR_DOCS,
  BADGE_DOCS,
  BREADCRUMB_DOCS,
  BUTTON_DOCS,
  CARD_DOCS,
  CHOICE_DOCS,
  COMBOBOX_DOCS,
  CURRENCY_INPUT_DOCS,
  DATE_PICKER_DOCS,
  DIALOG_DOCS,
  DIVIDER_DOCS,
  DRAWER_DOCS,
  EMPTY_STATE_DOCS,
  FIELD_DOCS,
  FILE_UPLOAD_DOCS,
  ICON_DOCS,
  ICON_BUTTON_DOCS,
  INPUT_DOCS,
  LINK_DOCS,
  LIST_DOCS,
  MASKED_INPUT_DOCS,
  MENU_DOCS,
  PAGINATION_DOCS,
  POPOVER_DOCS,
  PROGRESS_BAR_DOCS,
  SELECT_DOCS,
  SKELETON_DOCS,
  SPINNER_DOCS,
  STEPPER_DOCS,
  TABLE_DOCS,
  TABS_DOCS,
  TAG_DOCS,
  TIME_SLOTS_DOCS,
  TOAST_DOCS,
  TOOLTIP_DOCS,
  LIST_LOADING_DOCS,
];

export const DOC_PAGES = new InjectionToken<readonly DocPage[]>('DOC_PAGES', {
  providedIn: 'root',
  factory: () => ALL_DOC_PAGES,
});

const CATEGORY_PATHS: Record<DocCategory, string> = {
  Guias: 'guias',
  Fundação: 'fundacao',
  'Design systems': 'design-systems',
  Componentes: 'componentes',
  Padrões: 'padroes',
  Templates: 'templates',
};

/** Segmento da URL de cada categoria: "Padrões" → "padroes". */
export function categoryPath(category: DocCategory): string {
  return CATEGORY_PATHS[category];
}

/** Caminho da página no catálogo: /componentes/button. */
export function pagePath(page: DocPage): string {
  return `/${categoryPath(page.category)}/${page.slug}`;
}

export function findPage(
  pages: readonly DocPage[],
  category: string,
  slug: string,
): DocPage | undefined {
  return pages.find((page) => categoryPath(page.category) === category && page.slug === slug);
}
