import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ArgIcon, argIconsAll } from '@brunomonfardini/ui';
import { normalize } from '../../shell/navigation';

/** Todos os ícones desenhados pelo time, com busca e cópia do código. */
@Component({
  selector: 'doc-icons-page',
  imports: [ArgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icons-page.html',
  styleUrl: './icons-page.css',
})
export class IconsPage {
  protected readonly query = signal('');
  protected readonly copied = signal<string | undefined>(undefined);
  protected readonly total = argIconsAll.length;
  protected readonly icons = computed(() => {
    const term = normalize(this.query().trim());
    return argIconsAll.filter((icon) => icon.name.includes(term));
  });

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected snippet(name: string): string {
    return `<arg-icon name="${name}" />`;
  }

  protected async copy(name: string): Promise<void> {
    await navigator.clipboard.writeText(this.snippet(name));
    this.copied.set(name);
  }
}
