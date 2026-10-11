import { Component, signal } from '@angular/core';
import { ARG_CHOICE } from '../choice';

/** O switch vale na hora: sem botão de salvar. */
@Component({
  selector: 'doc-choice-switch-example',
  imports: [ARG_CHOICE],
  template: `
    <arg-choice-group label="Lembretes">
      <label arg-choice>
        <input type="checkbox" arg-switch [checked]="sms()" (change)="sms.set(!sms())" />
        Lembrete por SMS
      </label>
      <label arg-choice>
        <input type="checkbox" arg-switch [checked]="email()" (change)="email.set(!email())" />
        Lembrete por e-mail
      </label>
      <label arg-choice>
        <input type="checkbox" arg-switch disabled />
        Lembrete por WhatsApp (em breve)
      </label>
    </arg-choice-group>
  `,
})
export class ChoiceSwitchExample {
  protected readonly sms = signal(true);
  protected readonly email = signal(false);
}
