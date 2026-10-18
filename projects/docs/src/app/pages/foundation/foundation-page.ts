import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ARG_SHARED_PALETTES, ArgButton, ArgTheme } from '@brunomonfardini/ui';
import { DOC_MANIFEST } from '../../manifest';
import { DocThemeVersion } from '../../shared/theme-version';
import { computedTokenValue } from '../tokens/token-kind';
import { findTopic, topicTokens } from './topics';

interface FoundationRow {
  name: string;
  value: string;
  current: string;
}

/**
 * Uma página da Fundação (Cores, Tipografia, Espaçamento, Raio e elevação,
 * Movimento): os tokens do tópico com amostra e o valor no design system, na
 * paleta e no modo escolhidos agora.
 */
@Component({
  selector: 'doc-foundation-page',
  imports: [ArgButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './foundation-page.html',
  styleUrl: './foundation-page.css',
})
export class FoundationPage {
  /** Slug do tópico, vindo da rota. */
  readonly slug = input.required<string>();

  private readonly tokens = inject(DOC_MANIFEST).tokens;
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly version = inject(DocThemeVersion);
  private readonly theme = inject(ArgTheme);

  protected readonly topic = computed(() => findTopic(this.slug()));
  /** "Punk com a paleta Viva, escuro": de onde vêm os valores mostrados. */
  protected readonly context = computed(() => {
    const palette = this.theme.palette();
    const paletteName =
      palette === 'nativa'
        ? 'a paleta nativa'
        : `a paleta ${ARG_SHARED_PALETTES[palette as keyof typeof ARG_SHARED_PALETTES].nome}`;
    const scheme = { light: 'claro', dark: 'escuro', auto: 'automático' }[this.theme.colorScheme()];
    return `${this.theme.designSystem().nome} com ${paletteName}, modo ${scheme}`;
  });
  protected readonly rows = computed<FoundationRow[]>(() => {
    const topic = this.topic();
    if (!topic) return [];
    this.version.version();
    return topicTokens(topic, this.tokens).map((token) => ({
      name: token.name,
      value: token.value,
      current: computedTokenValue(token.name, this.root) || '—',
    }));
  });
  /** A amostra de movimento: anda quando a pessoa pede. */
  protected readonly moved = signal(false);

  protected move(): void {
    this.moved.update((moved) => !moved);
  }
}
