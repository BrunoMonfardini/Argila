import { jest } from '@jest/globals';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_FIELD } from '../field/field';
import { ArgAnnouncer } from '../internal/announcer';
import { ArgInput, ArgTextarea, ARG_INPUT_GROUP } from './input';
import { ArgIconButton } from '../icon-button/icon-button';
import { provideArgIcons } from '../icon/icon-registry';
import { argIconPlus } from '../icon/icons.generated';

@Component({
  imports: [ARG_FIELD, ArgInput, ArgTextarea, ReactiveFormsModule, FormField],
  template: `
    <arg-field label="Nome" hint="Como está no documento." [error]="error()">
      <input arg-input id="reativo" [formControl]="name" />
    </arg-field>
    <arg-field label="E-mail">
      <input arg-input id="sinais" [formField]="contact.email" />
    </arg-field>
    <arg-field label="Apelido">
      <input arg-input id="signal" [value]="nickname()" (input)="onNickname($event)" />
    </arg-field>
    <arg-field label="Observações">
      <textarea arg-textarea id="texto" [formControl]="notes"></textarea>
    </arg-field>
    <input arg-input id="solto" aria-label="Busca" />
  `,
})
class Host {
  readonly error = signal<string | null>(null);
  readonly name = new FormControl('Maria', { nonNullable: true });
  readonly notes = new FormControl('', { nonNullable: true });
  readonly model = signal({ email: 'a@b.com' });
  readonly contact = form(this.model);
  readonly nickname = signal('Mari');

  onNickname(event: Event): void {
    this.nickname.set((event.target as HTMLInputElement).value);
  }
}

function type(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('input'));
}

describe('ArgInput e ArgTextarea', () => {
  async function setup() {
    TestBed.configureTestingModule({
      providers: [{ provide: ArgAnnouncer, useValue: { announce: jest.fn() } }],
    });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const $ = <T extends HTMLElement>(id: string) => root.querySelector<T>(`#${id}`)!;
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      reactive: $<HTMLInputElement>('reativo'),
      signalForm: $<HTMLInputElement>('sinais'),
      plain: $<HTMLInputElement>('signal'),
      textarea: $<HTMLTextAreaElement>('texto'),
      loose: $<HTMLInputElement>('solto'),
    };
  }

  it('são os controles nativos, com a classe do Argila', async () => {
    const { reactive, textarea } = await setup();

    expect(reactive.tagName).toBe('INPUT');
    expect(reactive.classList).toContain('arg-input');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.classList).toContain('arg-textarea');
  });

  it('funcionam com Reactive Forms nos dois sentidos', async () => {
    const { fixture, host, reactive, textarea } = await setup();
    expect(reactive.value).toBe('Maria');

    type(reactive, 'Maria Souza');
    type(textarea, 'Alérgico a dipirona');
    expect(host.name.value).toBe('Maria Souza');
    expect(host.notes.value).toBe('Alérgico a dipirona');

    host.name.setValue('Ana');
    host.name.disable();
    await fixture.whenStable();
    expect(reactive.value).toBe('Ana');
    expect(reactive.disabled).toBe(true);
  });

  it('funcionam com formulário de signals ([formField])', async () => {
    const { fixture, host, signalForm } = await setup();
    expect(signalForm.value).toBe('a@b.com');

    type(signalForm, 'maria@exemplo.com');
    expect(host.model().email).toBe('maria@exemplo.com');

    host.model.set({ email: 'ana@exemplo.com' });
    await fixture.whenStable();
    expect(signalForm.value).toBe('ana@exemplo.com');
  });

  it('funcionam com um signal e [value]/(input)', async () => {
    const { host, plain } = await setup();
    expect(plain.value).toBe('Mari');

    type(plain, 'Mariana');

    expect(host.nickname()).toBe('Mariana');
  });

  it('se ligam sozinhos ao arg-field: rótulo, ajuda e erro', async () => {
    const { fixture, host, root, reactive } = await setup();
    expect(accessibleName(reactive)).toBe('Nome');
    expect(reactive.getAttribute('id')).toBe('reativo');

    host.error.set('Informe o nome.');
    await fixture.whenStable();

    const describedBy = reactive.getAttribute('aria-describedby')!.split(' ');
    const texts = describedBy.map((id) => root.querySelector(`#${id}`)?.textContent);
    expect(texts).toEqual(['Como está no documento.', 'Informe o nome.']);
    expect(reactive.getAttribute('aria-invalid')).toBe('true');
  });

  it('fora de um arg-field, continuam sendo campos comuns', async () => {
    const { loose } = await setup();

    expect(loose.classList).toContain('arg-input');
    expect(loose.hasAttribute('aria-invalid')).toBe(false);
    expect(accessibleName(loose)).toBe('Busca');
  });

  it('não têm violações de acessibilidade, com e sem erro', async () => {
    const { fixture, host, root } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    host.error.set('Informe o nome.');
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });
});

describe('ArgInputGroup', () => {
  @Component({
    imports: [ArgInput, ArgIconButton, ARG_INPUT_GROUP],
    template: `
      <label for="servico">Serviço</label>
      <arg-input-group>
        <input arg-input id="servico" />
        <button arg-icon-button argInputAction icon="plus" label="Adicionar"></button>
      </arg-input-group>
    `,
  })
  class Host {}

  async function setup() {
    TestBed.configureTestingModule({ providers: [provideArgIcons([argIconPlus])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      root,
      group: root.querySelector('arg-input-group')!,
      input: root.querySelector('input')!,
      action: root.querySelector('button')!,
    };
  }

  it('junta o campo e o botão de ação, nessa ordem', async () => {
    const { group, input, action } = await setup();

    expect(group.classList).toContain('arg-input-group');
    expect(action.classList).toContain('arg-input-action');
    expect([...group.children]).toEqual([input, action]);
  });

  it('o botão tem nome próprio e entra no Tab depois do campo', async () => {
    const { action, input } = await setup();

    expect(accessibleName(action)).toBe('Adicionar');
    expect(action.tabIndex).toBe(0);
    expect(input.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
