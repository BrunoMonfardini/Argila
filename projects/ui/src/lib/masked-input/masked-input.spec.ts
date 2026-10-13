import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_FIELD } from '../field/field';
import { ArgMaskedInput } from './masked-input';
import { ArgMaskKind } from './masks';

@Component({
  imports: [ArgMaskedInput, ARG_FIELD, ReactiveFormsModule, FormField],
  template: `
    <arg-field label="CPF">
      <input [arg-mask]="kind()" id="doc" [formControl]="doc" />
    </arg-field>
    <arg-field label="Telefone">
      <input arg-mask="phone" id="tel" [formField]="contact.phone" />
    </arg-field>
  `,
})
class Host {
  readonly kind = signal<ArgMaskKind>('cpf');
  readonly doc = new FormControl('', Validators.required);
  readonly contactModel = signal({ phone: '' });
  readonly contact = form(this.contactModel);
}

describe('ArgMaskedInput', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const type = async (input: HTMLInputElement, text: string, caret = text.length) => {
      input.value = text;
      input.setSelectionRange(caret, caret);
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return {
      host: fixture.componentInstance,
      root,
      type,
      set,
      doc: root.querySelector<HTMLInputElement>('#doc')!,
      tel: root.querySelector<HTMLInputElement>('#tel')!,
    };
  }

  it('é um input de texto com teclado, exemplo e rótulo do tipo', async () => {
    const { doc, tel } = await setup();
    expect(doc.type).toBe('text');
    expect(doc.getAttribute('inputmode')).toBe('numeric');
    expect(doc.placeholder).toBe('000.000.000-00');
    expect(accessibleName(doc)).toBe('CPF');
    expect(tel.getAttribute('inputmode')).toBe('tel');
    expect(tel.getAttribute('autocomplete')).toBe('tel-national');
  });

  it('mostra com máscara e o formulário recebe só os dígitos', async () => {
    const { host, doc, type } = await setup();
    await type(doc, '1234567');
    expect(doc.value).toBe('123.456.7');
    expect(host.doc.value).toBe('1234567');

    await type(doc, '12345678909999');
    expect(doc.value).toBe('123.456.789-09');
    expect(host.doc.value).toBe('12345678909');
  });

  it('editar no meio mantém o cursor depois do caractere digitado', async () => {
    const { doc, type } = await setup();
    await type(doc, '123.456.789-09');

    // Apaga o "4" (posição 5 no texto com máscara): o cursor fica onde ele estava
    await type(doc, '123.56.789-09', 4);
    expect(doc.value).toBe('123.567.890-9');
    expect(doc.selectionStart).toBe(3);
  });

  it('Reactive Forms: vazio usa o required; incompleto e dígito errado têm erro próprio', async () => {
    const { host, doc, type } = await setup();
    expect(host.doc.errors).toEqual({ required: true });

    await type(doc, '1234567');
    expect(host.doc.errors).toEqual({ incomplete: true });

    await type(doc, '12345678900');
    expect(host.doc.errors).toEqual({ cpf: true });

    await type(doc, '12345678909');
    expect(host.doc.errors).toBeNull();
  });

  it('trocar o tipo troca a máscara e a validação (CNPJ alfanumérico)', async () => {
    const { host, doc, type, set } = await setup();
    await set((h) => h.kind.set('cnpj'));
    expect(doc.getAttribute('inputmode')).toBe('text');
    expect(doc.getAttribute('autocapitalize')).toBe('characters');

    await type(doc, '12abc34501de35');
    expect(doc.value).toBe('12.ABC.345/01DE-35');
    expect(host.doc.value).toBe('12ABC34501DE35');
    expect(host.doc.errors).toBeNull();

    await type(doc, '12ABC34501DE36');
    expect(host.doc.errors).toEqual({ cnpj: true });
  });

  it('valor vindo do formulário aparece com máscara; disable e touched', async () => {
    const { host, doc, set } = await setup();
    await set((h) => h.doc.setValue('52998224725'));
    expect(doc.value).toBe('529.982.247-25');

    await set((h) => h.doc.disable());
    expect(doc.disabled).toBe(true);

    await set((h) => h.doc.enable());
    doc.dispatchEvent(new Event('blur'));
    expect(host.doc.touched).toBe(true);
  });

  it('formulários de signals: celular e fixo, com o modelo sem máscara', async () => {
    const { host, tel, type, set } = await setup();
    await type(tel, '11912345678');
    expect(tel.value).toBe('(11) 91234-5678');
    expect(host.contactModel().phone).toBe('11912345678');

    await type(tel, '1123456789');
    expect(tel.value).toBe('(11) 2345-6789');

    await set((h) => h.contactModel.set({ phone: '21987654321' }));
    expect(tel.value).toBe('(21) 98765-4321');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
