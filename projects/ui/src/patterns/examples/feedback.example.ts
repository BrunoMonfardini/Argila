import { Component, inject, signal } from '@angular/core';
import { ArgAlert } from '../../lib/alert/alert';
import { ArgButton } from '../../lib/button/button';
import { ARG_FIELD } from '../../lib/field/field';
import { ArgInput } from '../../lib/input/input';
import { ArgToast } from '../../lib/toast/toast';

/** Enviar com erro: o campo diz o que corrigir; com tudo certo, um toast confirma. */
@Component({
  selector: 'doc-pattern-feedback-form',
  imports: [ArgAlert, ArgButton, ARG_FIELD, ArgInput],
  template: `
    <form class="doc-stack" (submit)="$event.preventDefault(); send()">
      @if (error()) {
        <div arg-alert tone="danger" heading="Confira o telefone">Faltam dígitos.</div>
      }
      <arg-field label="Telefone" hint="Com DDD" [error]="error() ? 'Use 10 ou 11 dígitos' : null">
        <input arg-input type="tel" [value]="phone()" (input)="phone.set(value($event))" />
      </arg-field>
      <button arg-button type="submit">Salvar</button>
    </form>
  `,
  styles: `
    .doc-stack {
      display: grid;
      gap: var(--arg-space-3);
      justify-items: start;
      max-width: 20rem;
    }

    arg-field {
      width: 100%;
    }
  `,
})
export class FeedbackFormExample {
  private readonly toast = inject(ArgToast);
  protected readonly phone = signal('1199');
  protected readonly error = signal(false);

  protected value(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected send(): void {
    const digits = this.phone().replace(/\D/g, '').length;
    this.error.set(digits < 10 || digits > 11);
    if (!this.error()) this.toast.show('Telefone salvo', { tone: 'success' });
  }
}

/** Aviso que fica: o que exige ação continua na tela até ser resolvido. */
@Component({
  selector: 'doc-pattern-feedback-persistent',
  imports: [ArgAlert, ArgButton],
  template: `
    <div arg-alert tone="warning" heading="Certificado vence em 5 dias">
      Sem ele, as notas fiscais param de sair.
      <button arg-button arg-alert-action size="sm" variant="secondary">Renovar agora</button>
    </div>
  `,
})
export class FeedbackPersistentExample {}
