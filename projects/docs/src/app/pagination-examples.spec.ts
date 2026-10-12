import { TestBed } from '@angular/core/testing';
import { PaginationClientsExample } from '../../../ui/src/lib/pagination/examples/pagination-clients.example';

/** O exemplo da Pagination troca a lista mostrada junto com a página. */
describe('exemplo da Pagination', () => {
  it('trocar de página mostra os clientes daquela página', async () => {
    const fixture = TestBed.createComponent(PaginationClientsExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const clients = () =>
      Array.from(root.querySelectorAll('[arg-list-title]')).map((el) => el.textContent?.trim());
    const button = (name: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('nav button')).find(
        (b) => (b.getAttribute('aria-label') ?? b.textContent?.trim()) === name,
      )!;

    // Começa na página 5: clientes 21 a 25
    expect(clients()).toEqual(['Ana 021', 'Bruno 022', 'Carla 023', 'Diego 024', 'Elisa 025']);

    button('Próxima').click();
    await fixture.whenStable();
    expect(clients()[0]).toBe('Fábio 026');

    // Última página: 117 clientes, 5 por página, sobram 2
    button('Página 24').click();
    await fixture.whenStable();
    expect(clients()).toEqual(['Fábio 116', 'Gabi 117']);
    expect(root.querySelector('.arg-pagination__status')?.textContent).toBe('Página 24 de 24');
  });
});
