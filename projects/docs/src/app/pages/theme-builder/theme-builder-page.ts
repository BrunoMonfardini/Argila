import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ArgPalette, ArgTheme } from '@brunomonfardini/ui';
import { DocCode } from '../../code/code';
import { DocThemeBar } from '../../shell/theme-bar';
import { htmlCode, segmentCode, segmentOf } from './theme-code';

/**
 * Montar tema: as mesmas escolhas da barra do topo, com o segmento e o HTML
 * que reproduzem num produto o que se vê no catálogo.
 */
@Component({
  selector: 'doc-theme-builder-page',
  imports: [DocCode, DocThemeBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="doc-page__category">Ferramentas</p>
    <h1>Montar tema</h1>
    <p class="doc-lead">
      Escolha o design system, a paleta, as cores, o modo e a transparência. O catálogo inteiro
      acompanha; copie o segmento (Angular) ou o HTML para o produto ficar igual.
    </p>

    <section aria-labelledby="escolhas">
      <h2 id="escolhas">Escolhas</h2>
      <doc-theme-bar class="doc-builder__bar" />
    </section>

    <section aria-labelledby="segmento">
      <h2 id="segmento">Segmento</h2>
      <p>No <code>app.config.ts</code> do produto:</p>
      <doc-code [code]="segment()" language="ts" label="Segmento para o provideArgila" />
    </section>

    <section aria-labelledby="html">
      <h2 id="html">HTML</h2>
      <p>Sem Angular (HTML estático, renderização no servidor), com o <code>temas.css</code>:</p>
      <doc-code [code]="html()" language="html" label="Atributos do html" />
    </section>
  `,
  styles: `
    :host {
      display: block;
      max-width: 60rem;
    }

    .doc-builder__bar {
      padding: var(--arg-space-4);
      border: 1px solid var(--arg-color-border);
      border-radius: var(--arg-radius-container);
      background: var(--arg-color-surface);
    }
  `,
})
export class ThemeBuilderPage {
  private readonly theme = inject(ArgTheme);

  private readonly current = computed(() =>
    segmentOf({
      style: this.theme.style(),
      palette: this.theme.palette(),
      defaultPalette: this.theme.palettes()[0] as ArgPalette,
      scheme: this.theme.colorScheme(),
      colors: this.theme.colors(),
      surfaceOpacity: this.theme.surfaceOpacity(),
      background: this.theme.background(),
      defaultBackground: this.theme.backgrounds()[0],
    }),
  );
  protected readonly segment = computed(() => segmentCode(this.current()));
  protected readonly html = computed(() => htmlCode(this.current()));
}
