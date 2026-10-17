import { jest } from '@jest/globals';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_FIELD } from '../field/field';
import { ArgAnnouncer } from '../internal/announcer';
import { ArgSelect } from './select';

@Component({
  imports: [ARG_FIELD, ArgSelect, ReactiveFormsModule, FormField],
  template: `
    <arg-field label="Serviço" hint="O preço vem depois." [error]="error()">
      <select arg-select id="reativo" [formControl]="service">
        <option value="" disabled>Escolha</option>
        <option value="banho">Banho</option>
        <option value="tosa">Tosa</option>
      </select>
    </arg-field>
    <arg-field label="Porte">
      <select arg-select id="sinais" [formField]="pet.size">
        <optgroup label="Comuns">
          <option value="pequeno">Pequeno</option>
          <option value="medio">Médio</option>
          <option value="grande">Grande</option>
        </optgroup>
      </select>
    </arg-field>
  `,
})
class Host {
  readonly error = signal<string | null>(null);
  readonly service = new FormControl('', { nonNullable: true });
  readonly model = signal({ size: 'pequeno' });
  readonly pet = form(this.model);
}

/** Como o navegador ao escolher uma opção: dispara input e change. */
function choose(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event('input'));
  select.dispatchEvent(new Event('change'));
}

describe('ArgSelect', () => {
  async function setup() {
    TestBed.configureTestingModule({
      providers: [{ provide: ArgAnnouncer, useValue: { announce: jest.fn() } }],
    });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      reactive: root.querySelector<HTMLSelectElement>('#reativo')!,
      signalForm: root.querySelector<HTMLSelectElement>('#sinais')!,
    };
  }

  it('é o select nativo, com as opções projetadas e a classe do Argila', async () => {
    const { reactive } = await setup();

    expect(reactive.tagName).toBe('SELECT');
    expect(reactive.classList).toContain('arg-select');
    expect(Array.from(reactive.options, (option) => option.value)).toEqual(['', 'banho', 'tosa']);
  });

  it('funciona com Reactive Forms nos dois sentidos', async () => {
    const { fixture, host, reactive } = await setup();

    choose(reactive, 'tosa');
    expect(host.service.value).toBe('tosa');

    host.service.setValue('banho');
    host.service.disable();
    await fixture.whenStable();
    expect(reactive.value).toBe('banho');
    expect(reactive.disabled).toBe(true);
  });

  it('funciona com formulário de signals, inclusive com optgroup', async () => {
    const { fixture, host, signalForm } = await setup();
    expect(signalForm.value).toBe('pequeno');

    choose(signalForm, 'grande');
    expect(host.model().size).toBe('grande');

    host.model.set({ size: 'medio' });
    await fixture.whenStable();
    expect(signalForm.value).toBe('medio');
  });

  it('se liga sozinho ao arg-field: rótulo, ajuda e erro', async () => {
    const { fixture, host, root, reactive } = await setup();
    expect(accessibleName(reactive)).toBe('Serviço');

    host.error.set('Escolha um serviço.');
    await fixture.whenStable();

    const texts = reactive
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => root.querySelector(`#${id}`)?.textContent);
    expect(texts).toEqual(['O preço vem depois.', 'Escolha um serviço.']);
    expect(reactive.getAttribute('aria-invalid')).toBe('true');
  });

  it('não tem violações de acessibilidade, com e sem erro', async () => {
    const { fixture, host, root } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    host.error.set('Escolha um serviço.');
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });
});
