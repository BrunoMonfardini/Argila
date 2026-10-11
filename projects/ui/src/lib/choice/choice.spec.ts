import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAnnouncer } from '../internal/announcer';
import { ARG_CHOICE } from './choice';

@Component({
  imports: [ARG_CHOICE, ReactiveFormsModule, FormField],
  template: `
    <arg-choice-group
      id="especie"
      label="Espécie"
      [hint]="hint()"
      [error]="error()"
      [required]="required()"
      [orientation]="orientation()"
    >
      <label arg-choice>
        <input type="radio" arg-radio value="gato" [formControl]="species" />
        Gato
      </label>
      <label arg-choice>
        <input type="radio" arg-radio value="cao" [formControl]="species" />
        Cão
      </label>
      <label arg-choice>
        <input type="radio" arg-radio name="proprio" value="outro" [formControl]="species" />
        Outro
      </label>
    </arg-choice-group>
    <arg-choice-group id="avisos" label="Avisos" name="avisos">
      <label arg-choice>
        <input type="checkbox" arg-checkbox [indeterminate]="partial()" [formField]="prefs.sms" />
        SMS
      </label>
      <label arg-choice>
        <input type="checkbox" arg-switch [checked]="on()" (change)="on.set(!on())" />
        E-mail
      </label>
    </arg-choice-group>
  `,
})
class Host {
  readonly hint = signal<string | undefined>('Escolha uma.');
  readonly error = signal<string | null>(null);
  readonly required = signal(false);
  readonly orientation = signal<'vertical' | 'horizontal'>('vertical');
  readonly partial = signal(false);
  readonly on = signal(false);
  readonly species = new FormControl('gato');
  readonly model = signal({ sms: false });
  readonly prefs = form(this.model);
}

@Component({
  imports: [ARG_CHOICE],
  template: `<arg-choice-group label="Período" name="periodo">
    <label arg-choice>
      <input type="radio" arg-radio value="manha" />
      Manhã
    </label>
  </arg-choice-group>`,
})
class NamedGroup {}

describe('controles de escolha', () => {
  async function setup() {
    const announce = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: ArgAnnouncer, useValue: { announce } }],
    });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const group = root.querySelector<HTMLElement>('#especie')!;
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      group,
      fieldset: group.querySelector('fieldset')!,
      radios: Array.from(group.querySelectorAll<HTMLInputElement>('input[type="radio"]')),
      checkbox: root.querySelector<HTMLInputElement>('[arg-checkbox]')!,
      toggle: root.querySelector<HTMLInputElement>('[arg-switch]')!,
      announce,
    };
  }

  it('o grupo é um fieldset com o título na legend', async () => {
    const { fieldset } = await setup();

    expect(fieldset.querySelector('legend')?.textContent?.trim()).toBe('Espécie');
  });

  it('dá um name comum aos radios, para o navegador navegar o grupo pelas setas', async () => {
    const { radios, root } = await setup();

    const [first, second, own] = radios.map((radio) => radio.getAttribute('name'));
    expect(first).toMatch(/^arg-choice-\d+$/);
    expect(second).toBe(first);
    expect(own).toBe('proprio');
    expect(root.querySelector('#avisos input')).not.toBeNull();
  });

  it('usa o name informado no grupo', async () => {
    await setup();
    const fixture = TestBed.createComponent(NamedGroup);
    await fixture.whenStable();

    const radio = (fixture.nativeElement as HTMLElement).querySelector('input')!;

    expect(radio.getAttribute('name')).toBe('periodo');
  });

  it('o radio funciona com Reactive Forms e o rótulo marca a opção', async () => {
    const { fixture, host, radios } = await setup();
    expect(radios[0].checked).toBe(true);

    radios[1].closest('label')!.click();
    await fixture.whenStable();

    expect(host.species.value).toBe('cao');
    expect(accessibleName(radios[1])).toBe('Cão');
  });

  it('o checkbox liga o estado indeterminado nativo e funciona com formulário de signals', async () => {
    const { fixture, host, checkbox } = await setup();
    expect(checkbox.indeterminate).toBe(false);

    host.partial.set(true);
    await fixture.whenStable();
    expect(checkbox.indeterminate).toBe(true);

    checkbox.click();
    await fixture.whenStable();
    expect(host.model().sms).toBe(true);
  });

  it('o switch tem role="switch" e acompanha o signal', async () => {
    const { fixture, host, toggle } = await setup();

    expect(toggle.getAttribute('role')).toBe('switch');
    toggle.click();
    await fixture.whenStable();

    expect(host.on()).toBe(true);
    expect(toggle.checked).toBe(true);
  });

  it('descreve o grupo com ajuda e erro, marca os radios e anuncia o erro', async () => {
    const { fixture, host, fieldset, radios, announce } = await setup();
    const hintId = fieldset.querySelector('.arg-choice-group__hint')!.id;
    expect(fieldset.getAttribute('aria-describedby')).toBe(hintId);

    host.error.set('Escolha uma espécie.');
    host.required.set(true);
    await fixture.whenStable();

    const errorId = fieldset.querySelector('.arg-choice-group__error')!.id;
    expect(fieldset.getAttribute('aria-describedby')).toBe(`${hintId} ${errorId}`);
    expect(radios.every((radio) => radio.getAttribute('aria-invalid') === 'true')).toBe(true);
    expect(radios[0].getAttribute('aria-required')).toBe('true');
    expect(announce).toHaveBeenCalledWith('Espécie: Escolha uma espécie.');
  });

  it('sem ajuda nem erro, o grupo não tem aria-describedby', async () => {
    const { fixture, host, fieldset } = await setup();

    host.hint.set(undefined);
    await fixture.whenStable();

    expect(fieldset.hasAttribute('aria-describedby')).toBe(false);
  });

  it('a orientação horizontal é uma classe do grupo', async () => {
    const { fixture, host, group } = await setup();

    host.orientation.set('horizontal');
    await fixture.whenStable();

    expect(group.classList).toContain('arg-choice-group--horizontal');
  });

  it('não tem violações de acessibilidade, com e sem erro', async () => {
    const { fixture, host, root } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    host.error.set('Escolha uma espécie.');
    host.partial.set(true);
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });
});
