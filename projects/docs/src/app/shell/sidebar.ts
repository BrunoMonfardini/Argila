import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ARG_LIST } from '@brunomonfardini/ui';
import { DocNavSection, filterNavigation } from './navigation';

/** Barra lateral do catálogo, montada com a lista do próprio Argila, com busca. */
@Component({
  selector: 'doc-sidebar',
  imports: [ARG_LIST, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class DocSidebar {
  readonly sections = input.required<DocNavSection[]>();
  /** Avisa quando um link é seguido, para fechar o menu no celular. */
  readonly navigate = output();

  protected readonly query = signal('');
  protected readonly visible = computed(() => filterNavigation(this.sections(), this.query()));

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
