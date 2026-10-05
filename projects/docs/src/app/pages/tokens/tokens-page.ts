import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject } from '@angular/core';
import { DOC_MANIFEST, ManifestToken } from '../../manifest';
import { DocThemeVersion } from '../../shared/theme-version';
import { TokenKind, computedTokenValue, tokenKind } from './token-kind';

interface TokenRow extends ManifestToken {
  kind: TokenKind;
  current: string;
}

interface TokenGroup {
  name: string;
  tokens: TokenRow[];
}

/** Os tokens semânticos, lidos do manifesto, com amostra e valor no tema atual. */
@Component({
  selector: 'doc-tokens-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tokens-page.html',
  styleUrl: './tokens-page.css',
})
export class TokensPage {
  private readonly tokens = inject(DOC_MANIFEST).tokens;
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly theme = inject(DocThemeVersion);

  protected readonly groups = computed<TokenGroup[]>(() => {
    this.theme.version();
    const groups = new Map<string, TokenRow[]>();
    for (const token of this.tokens) {
      const rows = groups.get(token.group) ?? [];
      rows.push({
        ...token,
        kind: tokenKind(token.name),
        current: computedTokenValue(token.name, this.root),
      });
      groups.set(token.group, rows);
    }
    return Array.from(groups, ([name, tokens]) => ({ name, tokens }));
  });

  protected slug(group: string): string {
    return (
      'grupo-' +
      group
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/\W+/g, '-')
    );
  }
}
