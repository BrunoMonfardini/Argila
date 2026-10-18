import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgDialog, ArgDialogRef, ArgDialogTitle } from '../dialog/dialog';
import { ArgDrawer } from './drawer';

@Component({
  imports: [ArgDialogTitle],
  template: `
    <h2 argDialogTitle>Filtros</h2>
    <div arg-dialog-content><input aria-label="Busca" arg-dialog-focus /></div>
    <footer arg-dialog-actions>
      <button type="button" (click)="ref.close('ok')">Aplicar</button>
    </footer>
  `,
})
class FiltersDrawer {
  readonly ref = inject<ArgDialogRef<string>>(ArgDialogRef);
}

describe('ArgDrawer', () => {
  let opener: HTMLButtonElement;

  beforeEach(() => {
    opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
  });

  afterEach(() => {
    TestBed.inject(ArgDialog).closeAll();
    opener.remove();
  });

  const drawer = () => document.querySelector<HTMLDialogElement>('dialog.arg-drawer');
  const open = (config = {}) =>
    TestBed.inject(ArgDrawer).open<FiltersDrawer, unknown, string>(FiltersDrawer, config);

  it('abre um <dialog> modal com as classes de gaveta, à direita por padrão', () => {
    open();
    const element = drawer()!;

    expect(element.hasAttribute('open')).toBe(true);
    expect(element.classList).toContain('arg-dialog');
    expect(element.classList).toContain('arg-drawer');
    expect(element.classList).toContain('arg-drawer-end');
    expect(accessibleName(element)).toBe('Filtros');
  });

  it('side start prende à esquerda; size passa adiante', () => {
    open({ side: 'start', size: 'sm' });
    const element = drawer()!;

    expect(element.classList).toContain('arg-drawer-start');
    expect(element.classList).not.toContain('arg-drawer-end');
    expect(element.classList).toContain('arg-dialog--sm');
  });

  it('side bottom sobe de baixo em qualquer largura', () => {
    open({ side: 'bottom' });
    const element = drawer()!;

    expect(element.classList).toContain('arg-drawer-bottom');
    expect(element.classList).not.toContain('arg-drawer-end');
    expect(accessibleName(element)).toBe('Filtros');
  });

  it('o diálogo comum não ganha as classes de gaveta', () => {
    TestBed.inject(ArgDialog).open(FiltersDrawer);
    expect(document.querySelector('dialog.arg-dialog')!.classList).not.toContain('arg-drawer');
  });

  it('comporta-se como o Dialog: foco inicial, resultado e foco devolvido', async () => {
    const ref = open();
    expect(document.activeElement).toBe(drawer()!.querySelector('input'));

    drawer()!.querySelector('button')!.click();

    expect(await ref.closed).toBe('ok');
    expect(drawer()).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('Esc fecha sem resultado', async () => {
    const ref = open();
    drawer()!.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(await ref.closed).toBeUndefined();
  });

  it('não tem violações de acessibilidade', () => {
    open();
    expect(a11yViolations(drawer()!)).toEqual([]);
  });
});
