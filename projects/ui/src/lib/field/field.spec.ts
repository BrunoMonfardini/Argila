import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArgAnnouncer } from '../internal/announcer';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_FIELD } from './field';

@Component({
  imports: [ARG_FIELD],
  template: `
    <arg-field label="E-mail" [hint]="hint()" [error]="error()" [required]="required()">
      <input argFieldControl type="email" />
    </arg-field>
    <arg-field label="Espécie">
      <select argFieldControl id="especie-propria">
        <option>Gato</option>
      </select>
    </arg-field>
    <input argFieldControl id="solto" aria-label="Fora de um campo" />
  `,
})
class Host {
  readonly hint = signal<string | undefined>('Para o lembrete.');
  readonly error = signal<string | null>(null);
  readonly required = signal(false);
}

describe('ArgField', () => {
  async function setup(initialError: string | null = null) {
    const announce = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: ArgAnnouncer, useValue: { announce } }],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error.set(initialError);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const [field] = Array.from(root.querySelectorAll('arg-field'));
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      field,
      input: root.querySelector<HTMLInputElement>('arg-field input')!,
      select: root.querySelector('select')!,
      loose: root.querySelector<HTMLInputElement>('#solto')!,
      announce,
    };
  }

  it('liga o rótulo ao controle por um id gerado', async () => {
    const { field, input } = await setup();

    const label = field.querySelector('label')!;

    expect(input.id).toMatch(/^arg-field-control-\d+$/);
    expect(label.getAttribute('for')).toBe(input.id);
    expect(accessibleName(input)).toBe('E-mail');
  });

  it('mantém o id que o controle já tinha', async () => {
    const { root, select } = await setup();

    expect(select.id).toBe('especie-propria');
    expect(root.querySelector('label[for="especie-propria"]')?.textContent?.trim()).toBe('Espécie');
  });

  it('descreve o controle com a ajuda', async () => {
    const { field, input } = await setup();

    const hint = field.querySelector('.arg-field__hint')!;

    expect(hint.textContent).toBe('Para o lembrete.');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('com erro, marca o controle como inválido e o descreve com ajuda e erro', async () => {
    const { fixture, host, field, input } = await setup();

    host.error.set('Informe um e-mail.');
    await fixture.whenStable();

    const hint = field.querySelector('.arg-field__hint')!;
    const error = field.querySelector('.arg-field__error')!;
    expect(error.textContent).toBe('Informe um e-mail.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(`${hint.id} ${error.id}`);
    expect(field.classList).toContain('arg-field--invalid');
  });

  it('sem ajuda nem erro, não deixa aria-describedby vazio', async () => {
    const { fixture, host, input } = await setup();

    host.hint.set(undefined);
    await fixture.whenStable();

    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });

  it('anuncia o erro quando ele aparece ou muda, não quando some ou se repete', async () => {
    const { fixture, host, announce } = await setup();

    host.error.set('Informe um e-mail.');
    await fixture.whenStable();
    host.error.set('Informe um e-mail.');
    await fixture.whenStable();
    host.error.set('Use o formato nome@exemplo.com.');
    await fixture.whenStable();
    host.error.set(null);
    await fixture.whenStable();

    expect(announce.mock.calls).toEqual([
      ['E-mail: Informe um e-mail.'],
      ['E-mail: Use o formato nome@exemplo.com.'],
    ]);
  });

  it('não anuncia o erro que já vem na primeira renderização', async () => {
    const { announce, input } = await setup('Informe um e-mail.');

    expect(announce).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('obrigatório mostra o asterisco só na tela e avisa o leitor pelo controle', async () => {
    const { fixture, host, field, input } = await setup();

    host.required.set(true);
    await fixture.whenStable();

    expect(field.querySelector('.arg-field__required')?.getAttribute('aria-hidden')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('fora de um arg-field, a diretiva não mexe no controle', async () => {
    const { loose } = await setup();

    expect(loose.id).toBe('solto');
    expect(loose.hasAttribute('aria-describedby')).toBe(false);
    expect(loose.hasAttribute('aria-invalid')).toBe(false);
  });

  it('não tem violações de acessibilidade, com e sem erro', async () => {
    const { fixture, host, root } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    host.error.set('Informe um e-mail.');
    host.required.set(true);
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });
});
