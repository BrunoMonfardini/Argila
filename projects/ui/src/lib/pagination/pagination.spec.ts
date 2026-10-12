import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAnnouncer } from '../internal/announcer';
import { ArgPagination, pageItems } from './pagination';

describe('pageItems', () => {
  it('mostra todas quando são poucas', () => {
    expect(pageItems(1, 1)).toEqual([1]);
    expect(pageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('põe reticências longe da página atual, sempre com a primeira e a última', () => {
    expect(pageItems(1, 20)).toEqual([1, 2, 'gap', 20]);
    expect(pageItems(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
    expect(pageItems(20, 20)).toEqual([1, 'gap', 19, 20]);
  });

  it('não esconde uma página só atrás de reticências', () => {
    expect(pageItems(4, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(pageItems(17, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
  });

  it('respeita a quantidade de vizinhas', () => {
    expect(pageItems(10, 20, 2)).toEqual([1, 'gap', 8, 9, 10, 11, 12, 'gap', 20]);
    expect(pageItems(3, 0)).toEqual([]);
  });
});

@Component({
  imports: [ArgPagination],
  template: `<nav arg-pagination [total]="total()" [(page)]="page"></nav>`,
})
class Host {
  readonly total = signal(12);
  readonly page = signal(3);
}

describe('ArgPagination', () => {
  async function setup() {
    const announce = vi
      .spyOn(TestBed.inject(ArgAnnouncer), 'announce')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const stable = () => fixture.whenStable();
    const buttons = () => Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
    const byName = (name: string) => buttons().find((b) => accessibleName(b) === name)!;
    return { host: fixture.componentInstance, root, stable, buttons, byName, announce };
  }

  afterEach(() => vi.restoreAllMocks());

  it('é um <nav> com nome, com os números e a posição visível', async () => {
    const { root, buttons } = await setup();
    expect(accessibleName(root.querySelector('nav')!)).toBe('Paginação');
    expect(buttons().map((b) => accessibleName(b))).toEqual([
      'Anterior',
      'Página 1',
      'Página 2',
      'Página 3',
      'Página 4',
      'Página 12',
      'Próxima',
    ]);
    expect(root.querySelector('.arg-pagination__status')?.textContent).toBe('Página 3 de 12');
  });

  it('a página atual tem aria-current="page"', async () => {
    const { buttons } = await setup();
    expect(buttons().filter((b) => b.getAttribute('aria-current') === 'page')).toHaveLength(1);
    expect(
      buttons()
        .find((b) => b.getAttribute('aria-current'))
        ?.textContent?.trim(),
    ).toBe('3');
  });

  it('número, anterior e próxima trocam a página e anunciam a posição', async () => {
    const { host, byName, stable, announce } = await setup();

    byName('Página 12').click();
    await stable();
    expect(host.page()).toBe(12);
    expect(announce).toHaveBeenLastCalledWith('Página 12 de 12');

    byName('Anterior').click();
    await stable();
    expect(host.page()).toBe(11);

    byName('Próxima').click();
    await stable();
    expect(host.page()).toBe(12);
    expect(announce).toHaveBeenCalledTimes(3);
  });

  it('nas pontas, Anterior e Próxima ficam aria-disabled, focáveis e sem efeito', async () => {
    const { host, byName, stable, announce } = await setup();

    byName('Página 12').click();
    await stable();
    const next = byName('Próxima');
    next.focus();
    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect(next.disabled).toBe(false);

    next.click();
    await stable();
    expect(host.page()).toBe(12);
    expect(document.activeElement).toBe(next);
    expect(announce).toHaveBeenCalledTimes(1);

    byName('Página 1').click();
    await stable();
    expect(byName('Anterior').getAttribute('aria-disabled')).toBe('true');
    expect(byName('Próxima').hasAttribute('aria-disabled')).toBe(false);
  });

  it('clicar na página atual não anuncia de novo', async () => {
    const { byName, stable, announce } = await setup();
    byName('Página 3').click();
    await stable();
    expect(announce).not.toHaveBeenCalled();
  });

  it('as reticências não são lidas', async () => {
    const { root } = await setup();
    const gap = root.querySelector('.arg-pagination__gap')!;
    expect(gap.getAttribute('aria-hidden')).toBe('true');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
