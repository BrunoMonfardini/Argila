import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_FIELD } from '../field/field';
import { ArgAnnouncer } from '../internal/announcer';
import { ArgCombobox, ArgComboboxOption, ArgComboboxSearch, filterOptions } from './combobox';

const PETS: ArgComboboxOption[] = [
  { value: '1', label: 'Thor', description: 'Golden, tutora Maria' },
  { value: '2', label: 'Mel', description: 'Gata, tutor João' },
  { value: '3', label: 'Pipoca' },
  { value: '4', label: 'Thóra' },
];

describe('filterOptions', () => {
  it('filtra por parte do nome, sem acento nem maiúsculas', () => {
    expect(filterOptions(PETS, 'tho').map((o) => o.label)).toEqual(['Thor', 'Thóra']);
    expect(filterOptions(PETS, 'THÓ').map((o) => o.label)).toEqual(['Thor', 'Thóra']);
    expect(filterOptions(PETS, '')).toHaveLength(4);
    expect(filterOptions(PETS, 'xyz')).toEqual([]);
  });
});

@Component({
  imports: [ArgCombobox, ARG_FIELD, ReactiveFormsModule, FormField],
  template: `
    <arg-field label="Pet">
      <input arg-combobox id="local" [options]="pets" [formControl]="pet" />
    </arg-field>
    <arg-field label="Tutor">
      <input arg-combobox id="remoto" [search]="search" [debounce]="0" [formField]="visit.tutor" />
    </arg-field>
  `,
})
class Host {
  readonly pets = PETS;
  readonly pet = new FormControl<string | null>(null);
  readonly visitModel = signal({ tutor: null as string | null });
  readonly visit = form(this.visitModel);
  /** Busca controlada pelo teste. */
  readonly calls: { term: string; resolve: (o: ArgComboboxOption[]) => void }[] = [];
  readonly search: ArgComboboxSearch = (term) =>
    new Promise((resolve) => this.calls.push({ term, resolve }));
}

describe('ArgCombobox', () => {
  async function setup() {
    const announce = vi
      .spyOn(TestBed.inject(ArgAnnouncer), 'announce')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const stable = async () => {
      await new Promise((r) => setTimeout(r));
      await fixture.whenStable();
    };
    const local = root.querySelector<HTMLInputElement>('#local')!;
    const remote = root.querySelector<HTMLInputElement>('#remoto')!;
    const listOf = (input: HTMLInputElement) =>
      root.querySelector<HTMLElement>(`#${input.getAttribute('aria-controls')}`)!;
    const labels = (input: HTMLInputElement) =>
      Array.from(listOf(input).querySelectorAll('[role="option"] .arg-combobox__label')).map(
        (el) => el.textContent,
      );
    const type = async (input: HTMLInputElement, text: string) => {
      input.focus();
      input.value = text;
      input.dispatchEvent(new Event('input'));
      await stable();
    };
    const press = async (input: HTMLInputElement, key: string, altKey = false) => {
      const event = new KeyboardEvent('keydown', { key, altKey, bubbles: true, cancelable: true });
      input.dispatchEvent(event);
      await stable();
      return event;
    };
    return {
      host: fixture.componentInstance,
      root,
      stable,
      local,
      remote,
      listOf,
      labels,
      type,
      press,
      announce,
    };
  }

  afterEach(() => vi.restoreAllMocks());

  it('tem os papéis e as ligações do combobox', async () => {
    const { local, listOf } = await setup();
    expect(local.getAttribute('role')).toBe('combobox');
    expect(local.getAttribute('aria-autocomplete')).toBe('list');
    expect(local.getAttribute('aria-expanded')).toBe('false');
    expect(accessibleName(local)).toBe('Pet');
    const list = listOf(local);
    expect(list.getAttribute('role')).toBe('listbox');
    expect(accessibleName(list)).toBe('Sugestões');
  });

  it('digitar filtra, abre a lista e anuncia quantos resultados', async () => {
    const { local, labels, type, announce } = await setup();
    await type(local, 'tho');
    expect(local.getAttribute('aria-expanded')).toBe('true');
    expect(labels(local)).toEqual(['Thor', 'Thóra']);
    expect(announce).toHaveBeenLastCalledWith('2 resultados');
    expect(local.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('setas andam pelas opções com aria-activedescendant e dão a volta; Enter escolhe', async () => {
    const { host, local, listOf, type, press } = await setup();
    await type(local, 'tho');
    const option = () =>
      listOf(local).querySelector(`#${local.getAttribute('aria-activedescendant')}`);

    await press(local, 'ArrowDown');
    expect(option()?.textContent).toContain('Thor');
    await press(local, 'ArrowDown');
    expect(option()?.textContent).toContain('Thóra');
    await press(local, 'ArrowDown');
    expect(option()?.textContent).toContain('Thor');
    await press(local, 'ArrowUp');
    expect(option()?.textContent).toContain('Thóra');
    expect(document.activeElement).toBe(local);

    const enter = await press(local, 'Enter');
    expect(enter.defaultPrevented).toBe(true);
    expect(host.pet.value).toBe('4');
    expect(local.value).toBe('Thóra');
    expect(local.getAttribute('aria-expanded')).toBe('false');
  });

  it('↓ com a lista fechada abre na primeira; ↑, na última; Alt+↑ fecha', async () => {
    const { local, listOf, press } = await setup();
    local.focus();
    await press(local, 'ArrowDown');
    const active = () =>
      listOf(local).querySelector(`#${local.getAttribute('aria-activedescendant')}`);
    expect(local.getAttribute('aria-expanded')).toBe('true');
    expect(active()?.textContent).toContain('Thor');

    await press(local, 'ArrowUp', true);
    expect(local.getAttribute('aria-expanded')).toBe('false');

    await press(local, 'ArrowUp');
    expect(active()?.textContent).toContain('Thóra');
  });

  it('Esc fecha; com a lista fechada, limpa o campo e o valor', async () => {
    const { host, local, type, press } = await setup();
    await type(local, 'mel');
    await press(local, 'ArrowDown');
    await press(local, 'Enter');
    expect(host.pet.value).toBe('2');

    await type(local, 'pi');
    const esc = await press(local, 'Escape');
    expect(esc.defaultPrevented).toBe(true);
    expect(local.getAttribute('aria-expanded')).toBe('false');

    await press(local, 'Escape');
    expect(local.value).toBe('');
    expect(host.pet.value).toBeNull();
  });

  it('clique numa opção escolhe', async () => {
    const { host, local, listOf, type, stable } = await setup();
    await type(local, 'pi');
    listOf(local).querySelector<HTMLElement>('[role="option"]')!.click();
    await stable();
    expect(host.pet.value).toBe('3');
    expect(local.value).toBe('Pipoca');
  });

  it('a opção escolhida fica com aria-selected', async () => {
    const { local, listOf, type, press } = await setup();
    await type(local, 'mel');
    await press(local, 'ArrowDown');
    await press(local, 'Enter');
    await press(local, 'ArrowDown');
    const selected = listOf(local).querySelector('[aria-selected="true"]');
    expect(selected?.textContent).toContain('Mel');
  });

  it('sair do campo fecha e volta o texto da opção escolhida', async () => {
    const { host, local, type, stable } = await setup();
    host.pet.setValue('1');
    await stable();
    expect(local.value).toBe('Thor');

    await type(local, 'xyz');
    local.dispatchEvent(new Event('blur'));
    await stable();
    expect(local.value).toBe('Thor');
    expect(local.getAttribute('aria-expanded')).toBe('false');
    expect(host.pet.value).toBe('1');
  });

  it('nenhum resultado: mostra e anuncia o texto de vazio', async () => {
    const { local, listOf, type, announce } = await setup();
    await type(local, 'xyz');
    expect(listOf(local).parentElement!.textContent).toContain('Nenhum resultado.');
    expect(announce).toHaveBeenLastCalledWith('Nenhum resultado.');
  });

  it('busca assíncrona: carregando, resultados e respostas atrasadas descartadas', async () => {
    const { host, remote, labels, listOf, type, press, announce } = await setup();
    await type(remote, 'ma');
    expect(listOf(remote).parentElement!.textContent).toContain('Buscando…');

    await type(remote, 'mar');
    expect(host.calls.map((c) => c.term)).toEqual(['ma', 'mar']);
    // A resposta de "mar" chega antes; a de "ma", atrasada, é ignorada
    host.calls[1].resolve([{ value: 't1', label: 'Maria Souza' }]);
    await new Promise((r) => setTimeout(r));
    host.calls[0].resolve([
      { value: 'x', label: 'Marcos' },
      { value: 'y', label: 'Mara' },
    ]);
    await press(remote, 'Shift');

    expect(labels(remote)).toEqual(['Maria Souza']);
    expect(announce).toHaveBeenLastCalledWith('1 resultado');

    await press(remote, 'ArrowDown');
    await press(remote, 'Enter');
    expect(host.visitModel().tutor).toBe('t1');
    expect(remote.value).toBe('Maria Souza');
  });

  it('não tem violações de acessibilidade, fechado e aberto', async () => {
    const { root, local, type } = await setup();
    expect(a11yViolations(root)).toEqual([]);
    await type(local, 'tho');
    expect(a11yViolations(root)).toEqual([]);
  });
});
