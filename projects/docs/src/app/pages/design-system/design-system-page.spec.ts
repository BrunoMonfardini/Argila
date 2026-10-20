import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ARG_COMPONENTS, ARG_DESIGN_SYSTEMS, ArgTheme } from '@brunomonfardini/ui';
import { provideDocRouter } from '../../app.routes';

describe('DesignSystemPage', () => {
  async function open(url: string) {
    TestBed.configureTestingModule({ providers: [provideDocRouter()] });
    const harness = await RouterTestingHarness.create(url);
    return { harness, root: harness.routeNativeElement! };
  }

  afterEach(() => {
    TestBed.inject(ArgTheme).setStyle('argila');
    localStorage.clear();
  });

  const field = (root: HTMLElement, label: string) =>
    Array.from(root.querySelectorAll('dt'))
      .find((dt) => dt.textContent === label)
      ?.nextElementSibling?.textContent?.trim();

  it('a ficha sai do manifesto: linguagem, modos, transparência, paletas e fontes', async () => {
    const { root } = await open('/design-systems/punk');
    const punk = ARG_DESIGN_SYSTEMS.punk;

    expect(root.querySelector('h1')?.textContent).toBe('Punk');
    expect(root.querySelector('.doc-lead')?.textContent).toBe(punk.linguagem);
    expect(field(root, 'Modos')).toBe('escuro');
    expect(field(root, 'Transparência')).toBe('não aceita');
    expect(field(root, 'Paletas aceitas')).toBe('Nativa (padrão), Viva, Alto contraste');
    expect(field(root, 'Tipografia')).toBe('títulos em Unbounded; texto em fonte do sistema');
    expect(document.title).toBe('Punk · Argila');
  });

  it('mostra as regras de uso do manifesto', async () => {
    const { root } = await open('/design-systems/windows-xp');

    expect(Array.from(root.querySelectorAll('#regras + ul li'), (li) => li.textContent)).toEqual([
      ...ARG_DESIGN_SYSTEMS['windows-xp'].regras,
    ]);
  });

  it('a matriz tem todo componente e os exclusivos, com a situação e link', async () => {
    const { root } = await open('/design-systems/windows-xp');
    const rows = Array.from(root.querySelectorAll('#componentes ~ .doc-table tbody tr'));
    const row = (name: string) =>
      rows.find((tr) => tr.querySelector('th')?.textContent?.trim() === name);

    expect(rows.length).toBe(
      ARG_COMPONENTS.length + ARG_DESIGN_SYSTEMS['windows-xp'].exclusivos.length,
    );
    expect(row('Agenda')?.querySelector('td')?.textContent?.trim()).toBe('Fora');
    expect(row('Agenda')?.querySelector('a')).toBeNull();
    expect(row('Button')?.querySelector('td')?.textContent?.trim()).toBe('Curado');
    expect(row('Button')?.querySelector('a')?.getAttribute('href')).toBe('/componentes/button');
    expect(row('Janela (Windows XP)')?.querySelector('td')?.textContent?.trim()).toBe('Exclusivo');
    expect(root.querySelector('#componentes + p')?.textContent).toMatch(
      /^\d+ curados, \d+ herdados, 3 fora e 2 exclusivos\.$/,
    );
  });

  it('com outro DS aplicado, oferece a troca; aplicado, mostra os tokens de agora', async () => {
    const { harness, root } = await open('/design-systems/coda');

    expect(root.querySelector('#tokens ~ p')?.textContent).toContain('com o CODA aplicado');
    root.querySelector<HTMLButtonElement>('button')!.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(ArgTheme).style()).toBe('coda');
    expect(root.querySelector('[role="status"]')?.textContent).toContain('aplicado ao catálogo');
    expect(root.querySelectorAll('#tokens ~ .doc-table tbody tr').length).toBe(6);
  });

  it('no DS que aceita o degradê, sugere vê-lo com um clique', async () => {
    const { harness, root } = await open('/design-systems/transparente');
    const theme = TestBed.inject(ArgTheme);
    theme.setStyle('transparente');
    await harness.fixture.whenStable();

    const suggestion = root.querySelector('.doc-ds__suggestion')!;
    expect(suggestion.textContent).toContain('fica melhor sobre o fundo em degradê');
    suggestion.querySelector('button')!.click();
    await harness.fixture.whenStable();

    expect(theme.background()).toBe('degrade');
    expect(root.querySelector('.doc-ds__suggestion')).toBeNull();
    theme.setStyle('argila');
    document.documentElement.removeAttribute('data-arg-background');
    document.documentElement.removeAttribute('data-arg-style');
  });

  it('os DS internos não têm página', async () => {
    const { root } = await open('/design-systems/molde');

    expect(root.querySelector('h1')?.textContent).toBe('Página não encontrada');
  });
});
