import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARG_DESIGN_SYSTEMS, ArgAlert, ArgButton, ArgTheme } from '@brunomonfardini/ui';
import { DocAvailability, availabilityAcross, availabilityIn } from '../../availability';
import { DocCode } from '../../code/code';
import { DOC_MANIFEST, manifestPage } from '../../manifest';
import { DOC_PAGES, DocPage, findPage, pagePath } from '../../registry';
import { DocPlayground } from '../../playground/playground';
import { DocThemeChoices } from '../../shell/theme-choices';
import { DocText } from '../../shared/text';
import { DocAnatomy } from './anatomy';
import { DocExampleFrame } from './example-frame';
import { DocPropsTable } from './props-table';
import { DocRules } from './rules';
import { DocTab, DocTocEntry, pageTabs, tableOfContents } from './tabs';

const STATUS_LABELS: Record<DocAvailability, string> = {
  curado: 'curado',
  herdado: 'herdado, sem curadoria',
  fora: 'fora',
  exclusivo: 'exclusivo',
};

/** "17/10/2026 às 14:30", no horário de Brasília. */
const UPDATED_AT = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

export function formatUpdatedAt(iso: string): string {
  const parts = UPDATED_AT.formatToParts(new Date(iso));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${value('day')}/${value('month')}/${value('year')} às ${value('hour')}:${value('minute')}`;
}

/**
 * Página de um componente, padrão ou template, montada a partir do `DocPage`:
 * cabeçalho, situação no design system escolhido, abas com a aba ativa na URL
 * (`/componentes/button/codigo`) e o índice "Nesta página".
 */
@Component({
  selector: 'doc-component-page',
  imports: [
    ArgAlert,
    ArgButton,
    DocAnatomy,
    DocCode,
    DocExampleFrame,
    DocPlayground,
    DocPropsTable,
    DocRules,
    DocText,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-page.html',
  styleUrl: './component-page.css',
})
export class ComponentPage {
  /** Segmento da categoria na URL, vindo da rota. */
  readonly categoria = input.required<string>();
  /** Slug da página na URL, vindo da rota. */
  readonly slug = input.required<string>();
  /** Aba na URL; sem ela, a Visão geral. */
  readonly aba = input<string>();

  private readonly pages = inject(DOC_PAGES);
  private readonly manifest = inject(DOC_MANIFEST);
  private readonly theme = inject(ArgTheme);
  private readonly choices = inject(DocThemeChoices);

  protected readonly statusLabels = STATUS_LABELS;
  protected readonly page = computed(() => findPage(this.pages, this.categoria(), this.slug()));
  /** O que o manifesto leu do código: propriedades, tokens, o código dos exemplos e a data. */
  protected readonly generated = computed(() => {
    const page = this.page();
    return page ? manifestPage(this.manifest, page) : undefined;
  });
  protected readonly updatedAt = computed(() => {
    const date = this.generated()?.updatedAt;
    return date ? { iso: date, text: formatUpdatedAt(date) } : undefined;
  });

  protected readonly designSystem = this.theme.designSystem;
  /** Situação da página no design system escolhido; `undefined` em páginas que valem em todos. */
  protected readonly status = computed(() => {
    const page = this.page();
    return page ? availabilityIn(this.theme.style(), page, this.generated()) : undefined;
  });
  protected readonly availability = computed(() => {
    const page = this.page();
    return page ? availabilityAcross(page, this.generated()) : [];
  });
  /** Onde a página "fora" existe, para o aviso oferecer a troca. */
  protected readonly elsewhere = computed(() =>
    this.availability().filter((ds) => ds.status !== 'fora'),
  );

  /** "Componentes usados" de um padrão: as páginas de componente pelos slugs de `related`. */
  protected readonly related = computed(() =>
    (this.page()?.related ?? []).flatMap((slug) => {
      const page = this.pages.find((p) => p.category === 'Componentes' && p.slug === slug);
      return page ? [{ title: page.title, path: pagePath(page) }] : [];
    }),
  );

  protected readonly tabs = computed(() => {
    const page = this.page();
    return page ? pageTabs(page, Boolean(this.generated()?.component), this.status()) : [];
  });
  /** A aba da URL; `undefined` quando ela não existe nesta página. */
  protected readonly tab = computed(() =>
    this.tabs().find((tab) => tab.path === (this.aba() ?? '')),
  );
  /** Página e aba juntas: sem uma das duas, "Página não encontrada". */
  protected readonly current = computed(() => {
    const page = this.page();
    const tab = this.tab();
    return page && tab ? { page, tab } : undefined;
  });
  protected readonly toc = computed<DocTocEntry[]>(() => {
    const page = this.page();
    const tab = this.tab();
    const component = this.generated()?.component;
    return page && tab
      ? tableOfContents(page, tab.id, {
          playground: Boolean(component) && page.playground !== false,
          tokens: Boolean(component?.cssTokens.length),
          dsRules: this.dsRules().length > 0,
        })
      : [];
  });
  /** As regras do design system escolhido, na aba Regras de uso das páginas de componente. */
  protected readonly dsRules = computed(() =>
    this.status() ? (ARG_DESIGN_SYSTEMS[this.theme.style()].regras as readonly string[]) : [],
  );

  protected tabLink(page: DocPage, tab: DocTab): string[] {
    const base = ['/', this.categoria(), page.slug];
    return tab.path ? [...base, tab.path] : base;
  }

  protected switchTo(style: Parameters<DocThemeChoices['selectStyle']>[0]): void {
    this.choices.selectStyle(style);
  }
}
