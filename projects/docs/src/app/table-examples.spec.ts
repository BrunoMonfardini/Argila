import { TestBed } from '@angular/core/testing';
import { TablePetsExample } from '../../../ui/src/lib/table/examples/table-pets.example';

/** O exemplo da Table ordena, seleciona e mostra carregando e vazio. */
describe('exemplo da Table', () => {
  it('ordena, conta os selecionados e alterna carregando e vazio', async () => {
    const fixture = TestBed.createComponent(TablePetsExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const stable = () => fixture.whenStable();
    const firstPet = () => root.querySelector('tbody tr td:nth-child(2)')?.textContent?.trim();
    const button = (text: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((b) =>
        b.textContent?.trim().startsWith(text),
      )!;

    // Começa ordenado por Pet, crescente: "Ágata" primeiro
    expect(firstPet()).toBe('Ágata');
    expect(root.querySelector('tbody td:nth-child(6)')?.textContent?.trim()).toMatch(
      /^R\$\s120,00$/,
    );

    button('Visitas').click();
    await stable();
    expect(firstPet()).toBe('Ágata');
    button('Visitas').click();
    await stable();
    expect(firstPet()).toBe('Pipoca');

    root.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]')[0].click();
    await stable();
    expect(root.querySelector('.doc-bar span')?.textContent).toBe('1 selecionado');

    button('Ver carregando').click();
    await stable();
    expect(root.querySelector('table')?.getAttribute('aria-busy')).toBe('true');
    button('Mostrar dados').click();
    await stable();

    button('Ver vazio').click();
    await stable();
    expect(root.querySelector('.arg-table__empty')?.textContent).toContain('Nenhum pet cadastrado');
    expect(root.querySelector('.doc-bar span')?.textContent).toBe('Nenhum selecionado');
  });
});
