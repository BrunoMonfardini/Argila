import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DOC_MANIFEST } from '../../manifest';
import { DocText } from '../../shared/text';
import { parseChangelog } from './changelog';

/** Atualizações: o `CHANGELOG.md` do pacote, versão por versão. */
@Component({
  selector: 'doc-updates-page',
  imports: [DocText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="doc-page__category">Começo</p>
    <h1>Atualizações</h1>
    <p class="doc-lead">O que mudou em cada versão de <code>&#64;brunomonfardini/ui</code>.</p>
    @for (version of versions(); track version.version) {
      <section [attr.aria-labelledby]="'versao-' + $index">
        <h2 [id]="'versao-' + $index">{{ version.version }}</h2>
        @for (group of version.groups; track group.title) {
          <h3>{{ group.title }}</h3>
          <ul>
            @for (entry of group.entries; track $index) {
              <li>
                <doc-text [text]="entry.text" />
                @if (entry.items.length) {
                  <ul>
                    @for (item of entry.items; track $index) {
                      <li><doc-text [text]="item" /></li>
                    }
                  </ul>
                }
              </li>
            }
          </ul>
        }
      </section>
    } @empty {
      <p>Ainda não há versões publicadas.</p>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 60rem;
    }

    li + li {
      margin-block-start: var(--arg-space-2);
    }
  `,
})
export class UpdatesPage {
  private readonly manifest = inject(DOC_MANIFEST);
  protected readonly versions = computed(() => parseChangelog(this.manifest.changelog ?? ''));
}
