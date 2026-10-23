import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  ARG_BRAND_COLORS,
  type ArgBrandRole,
  ArgButton,
  type ArgColors,
  ArgFileUpload,
  ArgTheme,
} from '@brunomonfardini/ui';
import { DocThemeChoices } from '../../shell/theme-choices';
import { type BrandMatch, matchBrandColors } from './brand-match';
import { type ImagePalette, extractColors } from './image-colors';
import { DOC_IMAGE_READER } from './image-reader';

const ROLE_LABELS: Record<ArgBrandRole, string> = {
  primary: 'Primária',
  secondary: 'Secundária',
  accent: 'Destaque',
};

/** Até 10 MB: a imagem só é lida no navegador, mas uma foto enorme deixa a leitura lenta. */
const MAX_SIZE = 10 * 1024 * 1024;

interface Analysis {
  readonly palette: ImagePalette;
  readonly matches: readonly BrandMatch[];
  readonly url: string;
}

/**
 * "A partir de uma imagem", no Montar tema: tira as cores principais de uma
 * imagem enviada, escolhe as mais próximas da lista fixa, sugere o modo e,
 * ao aplicar, usa a imagem como fundo com o véu mínimo calculado para ela.
 * Nada sai do navegador.
 */
@Component({
  selector: 'doc-image-theme',
  imports: [ArgButton, ArgFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <arg-file-upload
      label="Imagem do produto"
      hint="JPG, PNG, WebP ou SVG, até 10 MB. A imagem não sai do navegador."
      accept="image/*"
      [maxSize]="maxSize"
      (valueChange)="analyze($event)"
    />

    @if (error()) {
      <p class="doc-image-theme__error" role="alert">{{ error() }}</p>
    }

    @if (analysis(); as result) {
      <p>
        Modo sugerido: <strong>{{ result.palette.scheme === 'dark' ? 'escuro' : 'claro' }}</strong
        >, pela luminosidade da imagem.
      </p>
      @if (result.matches.length) {
        <ul class="doc-image-theme__matches" aria-label="Cores escolhidas">
          @for (match of result.matches; track match.role) {
            <li>
              <span
                class="doc-image-theme__swatch"
                [style.background]="match.source"
                aria-hidden="true"
              ></span>
              <span aria-hidden="true">→</span>
              <span
                class="doc-image-theme__swatch"
                [style.background]="brandHex(match)"
                aria-hidden="true"
              ></span>
              <span>
                {{ roleLabel(match) }}: <strong>{{ brandName(match) }}</strong>
                <small
                  >(cor da imagem {{ match.source }}, distância
                  {{ match.distance.toFixed(2) }})</small
                >
              </span>
            </li>
          }
        </ul>
      } @else {
        <p>
          A imagem não tem cores marcantes (só preto, branco ou cinza); ficam as cores da paleta.
        </p>
      }
      @if (!acceptsImage()) {
        <p>O {{ dsName() }} não aceita o fundo de imagem: aplicar muda só o modo e as cores.</p>
      }
      <button arg-button variant="primary" type="button" (click)="apply()">
        Aplicar ao catálogo
      </button>
    }

    @if (showingImage()) {
      <p role="status">
        @if (veil() === undefined) {
          Calculando o véu para esta imagem…
        } @else {
          Véu de {{ veilPercent() }}%: o menor com que o texto da página passa sobre esta imagem,
          calculado pelo <code>ArgTheme</code>. Ele se recalcula sozinho quando o design system, a
          paleta, as cores ou o modo mudam, e no produto o <code>ArgTheme</code> faz a mesma conta
          com a sua imagem: o código não precisa levar o véu.
        }
      </p>
      <p>
        A imagem fica só nesta aba: o link e o código levam o modo e as cores, mas não a imagem. No
        produto, ponha a imagem em <code>src/assets/fundo.jpg</code> ou troque o caminho de
        <code>backgroundImage</code> no código. Ao recarregar, o catálogo volta à imagem de exemplo.
      </p>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--arg-space-3);
    }

    .doc-image-theme__matches {
      display: grid;
      gap: var(--arg-space-2);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .doc-image-theme__matches li {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-2);
      align-items: center;
    }

    .doc-image-theme__matches small {
      margin-inline-start: var(--arg-space-1);
      color: var(--arg-color-text-muted);
    }

    .doc-image-theme__swatch {
      inline-size: var(--arg-space-6);
      block-size: var(--arg-space-6);
      border: 1px solid var(--arg-color-border);
      border-radius: var(--arg-radius-control);
    }

    .doc-image-theme__error {
      color: var(--arg-color-danger);
    }

    button {
      justify-self: start;
    }
  `,
})
export class DocImageTheme {
  private readonly theme = inject(ArgTheme);
  private readonly choices = inject(DocThemeChoices);
  private readonly reader = inject(DOC_IMAGE_READER);

  protected readonly maxSize = MAX_SIZE;
  protected readonly analysis = signal<Analysis | undefined>(undefined);
  protected readonly error = signal<string | undefined>(undefined);
  /** A imagem enviada está no fundo do catálogo agora? */
  protected readonly showingImage = computed(
    () =>
      this.theme.background() === 'imagem' && this.theme.backgroundImage() === this.analysis()?.url,
  );
  /** O véu que o `ArgTheme` calculou para a imagem. */
  protected readonly veil = this.theme.backgroundVeil;
  protected readonly veilPercent = computed(() => Math.round((this.veil() ?? 0) * 100));
  protected readonly acceptsImage = computed(() => this.theme.backgrounds().includes('imagem'));
  protected readonly dsName = computed(() => this.theme.designSystem().nome);

  /** Lê a imagem enviada: as cores, o modo e as escolhas da lista fixa. */
  async analyze(files: File[]): Promise<void> {
    const file = files[0];
    this.error.set(undefined);
    if (!file) {
      this.analysis.set(undefined);
      return;
    }
    try {
      const palette = extractColors(await this.reader.pixels(file));
      const matches = matchBrandColors(palette.colors, palette.scheme, this.theme.allowedColors());
      // A imagem anterior, se não ficou no fundo, não serve mais
      const previous = this.analysis()?.url;
      if (previous && previous !== this.theme.backgroundImage()) this.reader.release(previous);
      this.analysis.set({ palette, matches, url: this.reader.url(file) });
    } catch {
      this.analysis.set(undefined);
      this.error.set('Não deu para ler esta imagem. Tente outra, em JPG, PNG, WebP ou SVG.');
    }
  }

  /** Aplica ao catálogo; o véu fica com o `ArgTheme`, que o calcula para a imagem. */
  apply(): void {
    const result = this.analysis();
    if (!result) return;
    const colors: ArgColors = Object.fromEntries(result.matches.map((m) => [m.role, m.color]));
    this.choices.selectImageTheme({
      scheme: result.palette.scheme,
      colors,
      image: result.url,
    });
  }

  protected roleLabel(match: BrandMatch): string {
    return ROLE_LABELS[match.role];
  }

  protected brandName(match: BrandMatch): string {
    return ARG_BRAND_COLORS[match.color].nome;
  }

  protected brandHex(match: BrandMatch): string {
    const info = ARG_BRAND_COLORS[match.color];
    return this.analysis()?.palette.scheme === 'dark' ? info.escuro : info.claro;
  }
}
