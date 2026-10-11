import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';

export type ArgAvatarSize = 'sm' | 'md' | 'lg';

/** "Maria da Silva Souza" → "MS": primeira letra do primeiro e do último nome. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toLocaleUpperCase('pt-BR');
}

/**
 * Foto de uma pessoa ou pet; sem foto (ou se ela não carregar), as iniciais
 * do nome:
 *
 * ```html
 * <arg-avatar name="Maria Souza" [src]="foto()" />
 * ```
 *
 * Ao lado do nome escrito, use `decorative` para o leitor não repetir o nome.
 */
@Component({
  selector: 'arg-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showImage()) {
      <img
        class="arg-avatar__image"
        [src]="src()"
        [alt]="decorative() ? '' : name()"
        (error)="failed.set(true)"
      />
    } @else {
      <span class="arg-avatar__initials" aria-hidden="true">{{ initials() }}</span>
    }
  `,
  styleUrl: './avatar.css',
  host: {
    class: 'arg-avatar',
    '[class]': '`arg-avatar--${size()}`',
    '[attr.role]': 'showImage() || decorative() ? null : "img"',
    '[attr.aria-label]': 'showImage() || decorative() ? null : name()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class ArgAvatar {
  /** Nome completo: vira o texto alternativo da foto e a fonte das iniciais. */
  readonly name = input.required<string>();
  /** Endereço da foto. Sem ele, ou se a foto não carregar, aparecem as iniciais. */
  readonly src = input<string | null>();
  /** Diâmetro: `sm` (24 px) em listas densas, `md` (40 px), `lg` (64 px) em perfis. */
  readonly size = input<ArgAvatarSize>('md');
  /** Esconde do leitor de tela quando o nome já está escrito ao lado. */
  readonly decorative = input(false, { transform: booleanAttribute });

  protected readonly failed = signal(false);
  protected readonly showImage = computed(() => !!this.src() && !this.failed());
  protected readonly initials = computed(() => initialsOf(this.name()));

  constructor() {
    // Uma foto nova merece outra tentativa, mesmo que a anterior tenha falhado
    effect(() => {
      this.src();
      this.failed.set(false);
    });
  }
}
