import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { a11yViolations } from '../../../../../ui/src/testing/a11y';
import { provideDocRouter } from '../../app.routes';
import { ALL_DOC_PAGES, DocPage } from '../../registry';
import { DocAnatomy, anatomyTargets, spreadMarkers } from './anatomy';

const WITH_ANATOMY = ALL_DOC_PAGES.filter((page) => page.anatomy);

describe('anatomia', () => {
  it('os 10 primeiros componentes têm anatomia', () => {
    expect(WITH_ANATOMY.map((page) => page.slug).sort()).toEqual([
      'alert',
      'button',
      'card',
      'dialog',
      'empty-state',
      'input',
      'select',
      'table',
      'tabs',
      'toast',
    ]);
  });

  async function render(page: DocPage) {
    TestBed.configureTestingModule({ providers: [provideArgIcons(argIconsAll)] });
    const fixture = TestBed.createComponent(DocAnatomy);
    fixture.componentRef.setInput('anatomy', page.anatomy);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it.each(WITH_ANATOMY.map((page) => [page.slug, page] as const))(
    '%s: cada parte da legenda existe no exemplo e ganha o seu número',
    async (_slug, page) => {
      const root = await render(page);
      const parts = page.anatomy!.parts;
      const stage = root.querySelector<HTMLElement>('.doc-anatomy__stage')!;
      const missing = anatomyTargets(stage, parts).flatMap((target, i) =>
        target ? [] : [parts[i].label],
      );

      expect(missing).toEqual([]);
      expect(
        Array.from(root.querySelectorAll('.doc-anatomy__marker'), (m) => m.textContent),
      ).toEqual(parts.map((_, i) => String(i + 1)));
      expect(
        Array.from(root.querySelectorAll('figcaption li strong'), (s) => s.textContent),
      ).toEqual(parts.map((part) => part.label));
      expect(a11yViolations(root)).toEqual([]);
    },
  );

  it('marcadores no mesmo canto andam para a direita, sem se cobrir', () => {
    expect(
      spreadMarkers([
        { number: 1, x: 0, y: 0 },
        { number: 2, x: 4, y: 2 },
        { number: 3, x: 100, y: 0 },
        { number: 4, x: 0, y: 60 },
      ]),
    ).toEqual([
      { number: 1, x: 0, y: 0 },
      { number: 2, x: 30, y: 2 },
      { number: 3, x: 100, y: 0 },
      { number: 4, x: 0, y: 60 },
    ]);
  });

  it('os marcadores são só desenho; a legenda é uma lista lida pelo leitor de tela', async () => {
    const root = await render(WITH_ANATOMY.find((page) => page.slug === 'button')!);

    expect(
      Array.from(root.querySelectorAll('.doc-anatomy__marker')).every(
        (marker) => marker.getAttribute('aria-hidden') === 'true',
      ),
    ).toBe(true);
    expect(root.querySelector('figure figcaption ol')).not.toBeNull();
  });

  it('a página do componente mostra a anatomia na Visão geral, com entrada no índice', async () => {
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), provideArgIcons(argIconsAll)],
    });
    const harness = await RouterTestingHarness.create('/componentes/card');
    const root = harness.routeNativeElement!;

    expect(root.querySelector('#anatomia ~ doc-anatomy')).not.toBeNull();
    expect(
      Array.from(root.querySelectorAll('.doc-page__toc a'), (a) => a.textContent?.trim()),
    ).toContain('Anatomia');
  });
});
