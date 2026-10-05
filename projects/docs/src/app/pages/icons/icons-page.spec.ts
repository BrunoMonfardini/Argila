import { TestBed } from '@angular/core/testing';
import { argIconsAll, provideArgIcons } from '@brunomonfardini/ui';
import { IconsPage } from './icons-page';

describe('IconsPage', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideArgIcons(argIconsAll)] });
    const fixture = TestBed.createComponent(IconsPage);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      root,
      tiles: () => Array.from(root.querySelectorAll<HTMLButtonElement>('.doc-icons__tile')),
      status: () => root.querySelector('[role="status"]')?.textContent?.trim(),
    };
  }

  it('mostra todos os ícones, cada um como botão com nome acessível', async () => {
    const { tiles, status } = await setup();

    expect(tiles().length).toBe(argIconsAll.length);
    expect(tiles()[0].getAttribute('aria-label')).toBe(
      `Copiar código do ícone ${argIconsAll[0].name}`,
    );
    expect(status()).toBe(`${argIconsAll.length} de ${argIconsAll.length} ícones`);
  });

  it('filtra pelo nome e avisa quando não encontra', async () => {
    const { fixture, root, tiles } = await setup();
    const search = root.querySelector<HTMLInputElement>('input[type="search"]')!;

    search.value = 'PLU';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(tiles().map((t) => t.textContent?.trim())).toEqual(['plus']);

    search.value = 'nada-assim';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(root.textContent).toContain('Nenhum ícone com "nada-assim"');
  });

  it('copia o código do ícone e anuncia', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { fixture, tiles, status } = await setup();
    const plus = tiles().find((t) => t.textContent?.includes('plus'))!;

    plus.click();
    await writeText.mock.results[0].value;
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith('<arg-icon name="plus" />');
    expect(status()).toBe('Copiado: <arg-icon name="plus" />');
  });
});
