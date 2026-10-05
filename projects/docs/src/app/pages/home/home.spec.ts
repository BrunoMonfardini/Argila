import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { provideDocRouter } from '../../app.routes';

describe('HomePage', () => {
  it('lista fundamentos e componentes com link e resumo, e mostra a instalação', async () => {
    TestBed.configureTestingModule({ providers: [provideDocRouter()] });
    const harness = await RouterTestingHarness.create('/');
    const root = harness.routeNativeElement!;

    const cards = Array.from(root.querySelectorAll<HTMLAnchorElement>('.doc-home__card'));
    const paths = cards.map((card) => card.getAttribute('href'));

    expect(root.querySelector('h1')?.textContent).toBe('Argila');
    expect(paths).toContain('/fundamentos/tokens');
    expect(paths).toContain('/fundamentos/icones');
    expect(paths).toContain('/componentes/button');
    expect(root.querySelector('doc-code pre')?.textContent).toBe('pnpm add @brunomonfardini/ui');
  });

  it('abre as páginas de fundamentos com título na aba', async () => {
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), provideArgIcons(argIconsAll)],
    });
    const harness = await RouterTestingHarness.create('/fundamentos/icones');

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Ícones');
    expect(document.title).toBe('Ícones · Argila');
  });
});
