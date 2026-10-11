import { TestBed } from '@angular/core/testing';
import { ArgDialog } from '@brunomonfardini/ui';
import { DrawerFiltersExample } from '../../../ui/src/lib/drawer/examples/drawer-filters.example';
import { DrawerNavigationExample } from '../../../ui/src/lib/drawer/examples/drawer-navigation.example';

/** Os exemplos do Drawer funcionam de ponta a ponta. */
describe('exemplos do Drawer', () => {
  const drawer = () => document.querySelector<HTMLDialogElement>('dialog.arg-drawer');
  const button = (root: ParentNode, text: string) =>
    Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
      (b) => b.textContent?.trim() === text,
    )!;

  afterEach(() => TestBed.inject(ArgDialog).closeAll());

  it('Filtros: marca, aplica e mostra os filtros escolhidos', async () => {
    const fixture = TestBed.createComponent(DrawerFiltersExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Filtros').click();
    expect(drawer()!.classList).toContain('arg-drawer-end');
    const boxes = drawer()!.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(boxes[0].checked).toBe(true);
    boxes[1].click();
    button(drawer()!, 'Aplicar').click();
    await fixture.whenStable();

    expect(drawer()).toBeNull();
    expect(root.querySelector('p')?.textContent?.trim()).toBe('Mostrando: Banho, Tosa');
  });

  it('Filtros: Limpar e Aplicar mostra todos', async () => {
    const fixture = TestBed.createComponent(DrawerFiltersExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Filtros').click();
    button(drawer()!, 'Limpar').click();
    button(drawer()!, 'Aplicar').click();
    await fixture.whenStable();

    expect(root.querySelector('p')?.textContent?.trim()).toBe('Mostrando todos os serviços');
  });

  it('Menu: abre à esquerda e fecha ao escolher uma página', async () => {
    const fixture = TestBed.createComponent(DrawerNavigationExample);
    await fixture.whenStable();

    button(fixture.nativeElement, 'Abrir menu').click();
    expect(drawer()!.classList).toContain('arg-drawer-start');
    drawer()!.querySelector('a')!.click();

    expect(drawer()).toBeNull();
  });
});
