import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ArgTheme, argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { a11yViolations } from '../../../../../ui/src/testing/a11y';
import { provideDocRouter } from '../../app.routes';
import {
  DEFAULT_SECTIONS,
  DocStyleSheet,
  RAMPS,
  SECTION_TITLES,
  STYLE_SHEET_SECTIONS,
  SWATCHES,
} from './style-sheet';

describe('folha de estilo', () => {
  async function render(style: 'argila' | 'punk' | 'coda' | 'neo-brutalista' | 'windows-xp') {
    TestBed.configureTestingModule({ providers: [provideArgIcons(argIconsAll)] });
    const fixture = TestBed.createComponent(DocStyleSheet);
    fixture.componentRef.setInput('style', style);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const headings = (root: HTMLElement) =>
    Array.from(root.querySelectorAll('h3'), (h) => h.textContent?.trim());

  afterEach(() => delete STYLE_SHEET_SECTIONS.coda);

  it('tem as seções da referência do Argila, na ordem dela', async () => {
    const root = await render('argila');

    expect(headings(root)).toEqual(DEFAULT_SECTIONS.map((section) => SECTION_TITLES[section]));
    expect(root.querySelectorAll('.doc-sheet__swatch').length).toBe(SWATCHES.length);
    expect(root.querySelectorAll('.doc-sheet__levels li').length).toBe(5);
  });

  it('cada DS pode ter a ordem e as seções da sua referência', async () => {
    STYLE_SHEET_SECTIONS.coda = ['cards', 'botoes'];
    const root = await render('coda');

    expect(headings(root)).toEqual(['Cards', 'Botões']);
  });

  it('o Neo-brutalista segue as seções da referência dele, sem violações', async () => {
    const root = await render('neo-brutalista');

    expect(headings(root)).toEqual(
      STYLE_SHEET_SECTIONS['neo-brutalista']!.map((section) => SECTION_TITLES[section]),
    );
    expect(root.querySelector('arg-stepper')).not.toBeNull();
    expect(root.querySelector('arg-table')).not.toBeNull();
    expect(a11yViolations(root)).toEqual([]);
  });

  it('o Windows XP tem as rampas, a janela, o balão e o cartão de regras da referência', async () => {
    const root = await render('windows-xp');

    expect(
      Array.from(root.querySelectorAll('.doc-sheet__section > h3'), (h) => h.textContent?.trim()),
    ).toEqual(STYLE_SHEET_SECTIONS['windows-xp']!.map((section) => SECTION_TITLES[section]));
    expect(root.querySelectorAll('.doc-sheet__ramp').length).toBe(RAMPS['windows-xp']!.length);
    expect(root.querySelectorAll('.doc-sheet__ramp-steps span').length).toBe(20);
    expect(root.querySelectorAll('section[arg-xp-window]').length).toBe(2);
    expect(root.querySelector('[arg-xp-balloon]')).not.toBeNull();
    expect(root.querySelectorAll('.doc-sheet__rules li').length).toBe(3);
    expect(root.querySelectorAll('.doc-sheet__icon-grid arg-icon').length).toBe(12);
    expect(a11yViolations(root)).toEqual([]);
  });

  it('o Punk mostra as telas do app da referência', async () => {
    const root = await render('punk');

    expect(
      Array.from(root.querySelectorAll('.doc-sheet__section > h3'), (h) => h.textContent?.trim()),
    ).toEqual(STYLE_SHEET_SECTIONS.punk!.map((section) => SECTION_TITLES[section]));
    expect(root.querySelector('arg-punk-burst')).not.toBeNull();
    expect(root.querySelectorAll('[arg-punk-stat-card]').length).toBe(4);
    expect(root.querySelectorAll('.doc-sheet__list-item--current').length).toBe(1);
    expect(root.querySelectorAll('.doc-sheet__section--notificacoes [arg-alert]').length).toBe(3);
    expect(root.querySelector('.doc-sheet__bottom-nav [aria-current="page"]')).not.toBeNull();
    expect(a11yViolations(root)).toEqual([]);
  });

  it('usa os componentes de verdade, sem violações de acessibilidade', async () => {
    const root = await render('argila');

    expect(root.querySelector('button[arg-button]')).not.toBeNull();
    expect(root.querySelectorAll('arg-tabs').length).toBe(2);
    expect(root.querySelectorAll('[arg-alert]').length).toBe(4);
    expect(a11yViolations(root)).toEqual([]);
  });

  it('aparece na página do DS só com o DS aplicado', async () => {
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), provideArgIcons(argIconsAll)],
    });
    const harness = await RouterTestingHarness.create('/design-systems/punk');
    const root = harness.routeNativeElement!;
    expect(root.querySelector('doc-style-sheet')).toBeNull();
    expect(root.querySelector('#folha-de-estilo ~ p')?.textContent).toContain(
      'com o Punk aplicado',
    );

    TestBed.inject(ArgTheme).setStyle('punk');
    await harness.fixture.whenStable();

    expect(root.querySelector('doc-style-sheet')).not.toBeNull();
    TestBed.inject(ArgTheme).setStyle('argila');
  });
});
