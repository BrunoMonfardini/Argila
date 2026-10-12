import { TestBed } from '@angular/core/testing';
import { BreadcrumbPetExample } from '../../../ui/src/lib/breadcrumb/examples/breadcrumb-pet.example';

/** Os links do exemplo do Breadcrumb não tiram a pessoa da página do catálogo. */
describe('exemplo do Breadcrumb', () => {
  it('clicar nos links não navega', async () => {
    const fixture = TestBed.createComponent(BreadcrumbPetExample);
    await fixture.whenStable();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a'),
    );

    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Clientes',
      'Maria Souza',
      'Pets',
    ]);
    for (const link of links) {
      const click = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(click);
      expect(click.defaultPrevented).toBe(true);
    }
  });
});
