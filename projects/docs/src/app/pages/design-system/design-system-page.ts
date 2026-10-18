import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ARG_COMPONENTS,
  ARG_DESIGN_SYSTEMS,
  ARG_SHARED_PALETTES,
  ArgButton,
  ArgDesignSystem,
  ArgStyle,
  ArgTheme,
} from '@brunomonfardini/ui';
import { DocAvailability, availabilityIn, coreComponentOf } from '../../availability';
import { DOC_MANIFEST, manifestPage } from '../../manifest';
import { DOC_PAGES, DocPage, pagePath } from '../../registry';
import { DocThemeChoices } from '../../shell/theme-choices';

export interface DocComponentRow {
  name: string;
  /** Caminho da página no catálogo; sem página, `undefined`. */
  path?: string;
  status: DocAvailability;
}

const SCHEME_LABELS = { light: 'claro', dark: 'escuro' } as const;
const STATUS_LABELS: Record<DocAvailability, string> = {
  curado: 'Curado',
  herdado: 'Herdado, sem curadoria',
  fora: 'Fora',
  exclusivo: 'Exclusivo',
};

/** Tokens de forma mostrados na ficha, com o valor de agora quando o DS está aplicado. */
export const SHAPE_TOKENS = [
  { token: '--arg-font-family-heading', label: 'Fonte dos títulos' },
  { token: '--arg-font-family', label: 'Fonte do texto' },
  { token: '--arg-radius-control', label: 'Raio dos controles' },
  { token: '--arg-radius-container', label: 'Raio dos contêineres' },
  { token: '--arg-border-width-control', label: 'Borda dos controles' },
  { token: '--arg-shadow-2', label: 'Sombra (nível 2)' },
];

/**
 * A ficha de um design system, montada só do manifesto (`ds.ts`): mudar o
 * manifesto muda a página. Componentes com a situação de cada um e os
 * exclusivos; os valores dos tokens aparecem com o DS aplicado.
 */
@Component({
  selector: 'doc-design-system-page',
  imports: [ArgButton, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-page.html',
  styleUrl: './design-system-page.css',
})
export class DesignSystemPage {
  /** Id do design system, vindo da rota. */
  readonly id = input.required<ArgStyle>();

  private readonly theme = inject(ArgTheme);
  private readonly choices = inject(DocThemeChoices);
  private readonly pages = inject(DOC_PAGES);
  private readonly manifest = inject(DOC_MANIFEST);
  private readonly root = inject(DOCUMENT).documentElement;

  protected readonly statusLabels = STATUS_LABELS;
  protected readonly ds = computed((): ArgDesignSystem => ARG_DESIGN_SYSTEMS[this.id()]);
  protected readonly active = computed(() => this.theme.style() === this.id());
  protected readonly schemes = computed(() =>
    this.ds()
      .modos.map((mode) => SCHEME_LABELS[mode])
      .join(' e '),
  );
  /** "Nativa (padrão), Viva, Alto contraste": a primeira é a padrão. */
  protected readonly palettes = computed(() =>
    this.ds()
      .paletas.map((id) =>
        id === 'nativa'
          ? 'Nativa'
          : ARG_SHARED_PALETTES[id as keyof typeof ARG_SHARED_PALETTES].nome,
      )
      .map((name, i) => (i === 0 ? `${name} (padrão)` : name))
      .join(', '),
  );
  protected readonly fonts = computed(() => {
    const fonts = this.ds().fontes;
    if (!fonts?.titulo && !fonts?.corpo) return 'Fonte do sistema operacional';
    return [
      fonts.titulo && `títulos em ${fonts.titulo}`,
      `texto em ${fonts.corpo ?? 'fonte do sistema'}`,
    ]
      .filter(Boolean)
      .join('; ');
  });

  /** Todos os componentes do núcleo e os exclusivos do DS, com a situação de cada um. */
  protected readonly components = computed((): DocComponentRow[] => {
    const style = this.id();
    const byComponent = new Map<string, DocPage>();
    for (const page of this.pages) {
      const name = coreComponentOf(manifestPage(this.manifest, page)?.file);
      if (name) byComponent.set(name, page);
    }
    const core = ARG_COMPONENTS.map((name): DocComponentRow => {
      const page = byComponent.get(name);
      const status = page
        ? availabilityIn(style, page, manifestPage(this.manifest, page))!
        : this.ds().componentes.fora.includes(name)
          ? 'fora'
          : 'herdado';
      return { name: page?.title ?? name, path: page && pagePath(page), status };
    });
    const exclusive = this.pages
      .filter((page) => page.designSystem === style)
      .map((page): DocComponentRow => ({
        name: page.title,
        path: pagePath(page),
        status: 'exclusivo',
      }));
    return [...exclusive, ...core];
  });
  protected readonly counts = computed(() => {
    const rows = this.components();
    const count = (status: DocAvailability) => rows.filter((row) => row.status === status).length;
    return {
      curado: count('curado'),
      herdado: count('herdado'),
      fora: count('fora'),
      exclusivo: count('exclusivo'),
    };
  });

  /** "19 curados, 17 herdados, 2 fora e 2 exclusivos." */
  protected readonly summary = computed(() => {
    const { curado, herdado, fora, exclusivo } = this.counts();
    const parts = [`${curado} curados`, `${herdado} herdados`, `${fora} fora`];
    if (exclusivo) parts.push(`${exclusivo} exclusivos`);
    return `${parts.slice(0, -1).join(', ')} e ${parts.at(-1)}.`;
  });

  /** Valores dos tokens de forma, lidos do `<html>`; só com este DS aplicado. */
  protected readonly tokens = computed(() => {
    if (!this.active()) return [];
    this.theme.palette();
    const style = getComputedStyle(this.root);
    return SHAPE_TOKENS.map((item) => ({
      ...item,
      value: style.getPropertyValue(item.token).trim() || '—',
    }));
  });

  protected apply(): void {
    this.choices.selectStyle(this.id());
  }
}
