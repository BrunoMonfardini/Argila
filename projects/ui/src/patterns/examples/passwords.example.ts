import { Component, computed, signal } from '@angular/core';
import { ARG_FIELD } from '../../lib/field/field';
import { ArgIconButton } from '../../lib/icon-button/icon-button';
import { ArgInput } from '../../lib/input/input';
import { ArgProgressBar } from '../../lib/progress-bar/progress-bar';

/** Quanto a senha cumpre das regras, de 0 a 4. */
export function passwordScore(password: string): number {
  return [/.{8,}/, /[A-Z]/, /\d/, /[^\w\s]/].filter((rule) => rule.test(password)).length;
}

/** Criar senha: as regras à vista, a força em barra e o botão de mostrar. */
@Component({
  selector: 'doc-pattern-password-create',
  imports: [ARG_FIELD, ArgIconButton, ArgInput, ArgProgressBar],
  template: `
    <div class="doc-stack">
      <arg-field label="Nova senha" hint="8 caracteres, com maiúscula, número e símbolo">
        <input
          arg-input
          autocomplete="new-password"
          [type]="visible() ? 'text' : 'password'"
          [value]="password()"
          (input)="password.set(value($event))"
        />
      </arg-field>
      <button
        arg-icon-button
        [icon]="visible() ? 'eye-off' : 'eye'"
        [label]="visible() ? 'Esconder senha' : 'Mostrar senha'"
        [attr.aria-pressed]="visible()"
        (click)="visible.set(!visible())"
      ></button>
      <progress
        arg-progress
        [label]="'Força da senha: ' + strength()"
        [value]="score()"
        [max]="4"
      ></progress>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
      max-width: 22rem;
    }

    arg-field,
    progress {
      width: 100%;
    }
  `,
})
export class PasswordCreateExample {
  protected readonly password = signal('');
  protected readonly visible = signal(false);
  protected readonly score = computed(() => passwordScore(this.password()));
  protected readonly strength = computed(
    () => ['muito fraca', 'fraca', 'média', 'boa', 'forte'][this.score()],
  );

  protected value(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}

/** Entrar: um campo de senha só, com o caminho para recuperar logo abaixo. */
@Component({
  selector: 'doc-pattern-password-login',
  imports: [ARG_FIELD, ArgInput],
  template: `
    <arg-field label="Senha">
      <input arg-input type="password" autocomplete="current-password" />
    </arg-field>
    <a href="#" (click)="$event.preventDefault()">Esqueci a senha</a>
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--arg-space-2);
      max-width: 22rem;
    }
  `,
})
export class PasswordLoginExample {}
