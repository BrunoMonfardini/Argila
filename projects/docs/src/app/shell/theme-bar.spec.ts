import { TestBed } from '@angular/core/testing';
import { ArgTheme } from '@brunomonfardini/ui';
import { DocThemeBar } from './theme-bar';

describe('DocThemeBar', () => {
  const root = document.documentElement;

  beforeEach(() => {
    localStorage.clear();
    root.removeAttribute('data-arg-brand');
    root.setAttribute('data-arg-theme', 'light');
  });

  async function setup() {
    const fixture = TestBed.createComponent(DocThemeBar);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(element.querySelectorAll('button'));
    return {
      fixture,
      button: (label: string) => buttons.find((b) => b.textContent?.trim() === label)!,
      select: element.querySelector('select')!,
    };
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

  it('aplica a marca no <html> e volta ao padrão sem atributo', async () => {
    const { select } = await setup();

    select.value = 'example';
    select.dispatchEvent(new Event('change'));
    expect(root.getAttribute('data-arg-brand')).toBe('example');
    expect(localStorage.getItem('argila-docs:marca')).toBe('example');

    select.value = 'argila';
    select.dispatchEvent(new Event('change'));
    expect(root.hasAttribute('data-arg-brand')).toBe(false);
  });

  it('restaura as escolhas salvas e ignora valores desconhecidos', async () => {
    localStorage.setItem('argila-docs:tema', 'auto');
    localStorage.setItem('argila-docs:marca', 'example');

    await setup();

    expect(root.getAttribute('data-arg-theme')).toBe('auto');
    expect(root.getAttribute('data-arg-brand')).toBe('example');

    localStorage.setItem('argila-docs:tema', 'roxo');
    root.setAttribute('data-arg-theme', 'light');
    TestBed.resetTestingModule();
    await setup();

    expect(root.getAttribute('data-arg-theme')).toBe('light');
  });
});
