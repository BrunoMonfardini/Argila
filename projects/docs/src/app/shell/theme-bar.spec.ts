import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ARG_DESIGN_SYSTEMS, ArgStyle, ArgTheme, provideArgila } from '@brunomonfardini/ui';
import { DOC_SEGMENTS } from '../segments';
import { DocThemeBar } from './theme-bar';

describe('DocThemeBar', () => {
  const root = document.documentElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideArgila({ segments: DOC_SEGMENTS })],
    });
    localStorage.clear();
    root.removeAttribute('data-arg-style');
    root.removeAttribute('data-arg-palette');
    for (const role of ['primary', 'secondary', 'accent']) root.removeAttribute(`data-arg-${role}`);
    root.style.removeProperty('--arg-surface-opacity');
    root.setAttribute('data-arg-theme', 'light');
  });

  async function setup() {
    const fixture = TestBed.createComponent(DocThemeBar);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(element.querySelectorAll('button'));
    const field = (label: string) =>
      Array.from(element.querySelectorAll('label')).find(
        (l) => l.querySelector('span')?.textContent === label,
      )!;
    return {
      fixture,
      button: (label: string) => buttons.find((b) => b.textContent?.trim() === label)!,
      select: (label: string) => field(label).querySelector('select')!,
      range: () => field('Opacidade').querySelector('input')!,
    };
  }

  function choose(control: HTMLSelectElement | HTMLInputElement, value: string, event = 'change') {
    control.value = value;
    control.dispatchEvent(new Event(event));
  }

  it('marca o modo de cor atual como pressionado', async () => {
    const { button } = await setup();

    expect(button('Claro').getAttribute('aria-pressed')).toBe('true');
    expect(button('Escuro').getAttribute('aria-pressed')).toBe('false');
  });

  it('troca o modo de cor com o ArgTheme e lembra a escolha', async () => {
    const { fixture, button } = await setup();

    button('Escuro').click();
    await fixture.whenStable();

    expect(root.getAttribute('data-arg-theme')).toBe('dark');
    expect(TestBed.inject(ArgTheme).colorScheme()).toBe('dark');
    expect(button('Escuro').getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('argila-docs:tema')).toBe('dark');
  });

  it('aplica estilo e paleta no <html> e lembra as escolhas', async () => {
    const { fixture, select } = await setup();

    expect(root.getAttribute('data-arg-style')).toBe('argila');
    expect(root.getAttribute('data-arg-palette')).toBe('nativa');

    choose(select('Estilo'), 'coda');
    // A lista de paletas muda com o estilo: a Viva só aparece no CODA
    await fixture.whenStable();
    choose(select('Paleta'), 'viva');

    expect(root.getAttribute('data-arg-style')).toBe('coda');
    expect(root.getAttribute('data-arg-palette')).toBe('viva');
    expect(localStorage.getItem('argila-docs:estilo')).toBe('coda');
    expect(localStorage.getItem('argila-docs:paleta')).toBe('viva');
  });

  it('oferece cada design system e só as paletas que ele aceita, e cada uma se aplica', async () => {
    const { fixture, select } = await setup();
    const values = (control: HTMLSelectElement) => Array.from(control.options, (o) => o.value);

    expect(values(select('Estilo'))).toEqual(Object.keys(ARG_DESIGN_SYSTEMS));

    for (const style of Object.keys(ARG_DESIGN_SYSTEMS) as ArgStyle[]) {
      choose(select('Estilo'), style);
      await fixture.whenStable();
      expect(values(select('Paleta'))).toEqual([...ARG_DESIGN_SYSTEMS[style].paletas]);

      for (const palette of ARG_DESIGN_SYSTEMS[style].paletas) {
        choose(select('Paleta'), palette);
        await fixture.whenStable();

        expect(root.getAttribute('data-arg-style')).toBe(style);
        expect(root.getAttribute('data-arg-palette')).toBe(palette);
        expect(select('Estilo').value).toBe(style);
        expect(select('Paleta').value).toBe(palette);
      }
    }
  });

  it('ajusta a opacidade das superfícies e volta à do estilo ao trocar de estilo', async () => {
    const { fixture, select, range } = await setup();

    expect(range().value).toBe('100');
    expect(range().min).toBe('40');

    choose(range(), '60', 'input');
    await fixture.whenStable();
    expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('0.6');
    expect(range().getAttribute('aria-valuetext')).toBe('60%');
    expect(localStorage.getItem('argila-docs:opacidade')).toBe('60');

    choose(select('Estilo'), 'molde');
    expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('');
  });

  it('desabilita a opacidade, com o motivo, no estilo que não aceita transparência', async () => {
    const { fixture, select, range } = await setup();

    choose(select('Estilo'), 'windows-xp');
    await fixture.whenStable();

    expect(range().disabled).toBe(true);
    expect(range().closest('label')!.title).toBe('Este estilo não aceita transparência');

    choose(select('Estilo'), 'transparente');
    await fixture.whenStable();
    expect(range().disabled).toBe(false);
  });

  it('desabilita os modos que o estilo não suporta', async () => {
    jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
      ...ARG_DESIGN_SYSTEMS.coda,
      modos: ['dark'],
    } as never);
    const { fixture, select, button } = await setup();

    choose(select('Estilo'), 'coda');
    await fixture.whenStable();

    expect(root.getAttribute('data-arg-theme')).toBe('dark');
    expect(button('Claro').disabled).toBe(true);
    expect(button('Automático').disabled).toBe(true);
    expect(button('Escuro').disabled).toBe(false);
    jest.restoreAllMocks();
  });

  it('restaura as escolhas salvas e ignora valores desconhecidos', async () => {
    localStorage.setItem('argila-docs:tema', 'auto');
    localStorage.setItem('argila-docs:estilo', 'transparente');
    localStorage.setItem('argila-docs:paleta', 'terrosa');
    localStorage.setItem('argila-docs:opacidade', '80');

    const { select } = await setup();

    expect(root.getAttribute('data-arg-theme')).toBe('auto');
    expect(root.getAttribute('data-arg-style')).toBe('transparente');
    // O seletor mostra o que está aplicado, não a primeira opção
    expect(select('Estilo').value).toBe('transparente');
    expect(select('Paleta').value).toBe('terrosa');
    expect(root.getAttribute('data-arg-palette')).toBe('terrosa');
    expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('0.8');

    localStorage.setItem('argila-docs:tema', 'roxo');
    localStorage.setItem('argila-docs:estilo', 'arcade');
    root.setAttribute('data-arg-theme', 'light');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    await setup();

    expect(root.getAttribute('data-arg-theme')).toBe('light');
    expect(root.getAttribute('data-arg-style')).toBe('argila');
  });

  it('oferece só as cores que passam no contraste e lembra a escolha', async () => {
    const { fixture, select } = await setup();
    const theme = TestBed.inject(ArgTheme);
    const values = (control: HTMLSelectElement) => Array.from(control.options, (o) => o.value);

    expect(values(select('Primária'))).toEqual(['', ...theme.allowedColors().primary]);

    choose(select('Primária'), 'cobre');
    await fixture.whenStable();
    expect(root.getAttribute('data-arg-primary')).toBe('cobre');
    expect(select('Primária').value).toBe('cobre');
    expect(localStorage.getItem('argila-docs:cores')).toBe('primaria:cobre');

    choose(select('Primária'), '');
    await fixture.whenStable();
    expect(root.hasAttribute('data-arg-primary')).toBe(false);
    expect(localStorage.getItem('argila-docs:cores')).toBe('');
  });

  it('aplica um segmento de exemplo e esquece o nome ao mudar algo à mão', async () => {
    const { fixture, select } = await setup();

    expect(Array.from(select('Segmento').options, (o) => o.textContent?.trim())).toEqual([
      'Nenhum',
      'Essencial',
      'Premium',
      'Vibrante',
    ]);

    choose(select('Segmento'), 'premium');
    await fixture.whenStable();
    expect(root.getAttribute('data-arg-style')).toBe('argila');
    expect(root.getAttribute('data-arg-palette')).toBe('terrosa');
    expect(root.getAttribute('data-arg-theme')).toBe('dark');
    expect(root.getAttribute('data-arg-primary')).toBe('cobre');
    expect(select('Segmento').value).toBe('premium');
    expect(localStorage.getItem('argila-docs:segmento')).toBe('premium');

    choose(select('Paleta'), 'oceano');
    await fixture.whenStable();
    expect(select('Segmento').value).toBe('');
    expect(localStorage.getItem('argila-docs:segmento')).toBe('');
  });
});
