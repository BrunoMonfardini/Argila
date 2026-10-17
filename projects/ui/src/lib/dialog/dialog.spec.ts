import { jest } from '@jest/globals';
import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import {
  ARG_DIALOG_DATA,
  ArgDialog,
  ArgDialogDescription,
  ArgDialogRef,
  ArgDialogTitle,
} from './dialog';

@Component({
  imports: [ArgDialogDescription, ArgDialogTitle],
  template: `
    <h2 argDialogTitle>Editar {{ data.name }}</h2>
    <p argDialogDescription>As mudanças valem para os próximos agendamentos.</p>
    <div arg-dialog-content><input aria-label="Nome" arg-dialog-focus /></div>
    <footer arg-dialog-actions>
      <button type="button" id="salvar" (click)="ref.close('Mel')">Salvar</button>
    </footer>
  `,
})
class EditDialog {
  readonly ref = inject<ArgDialogRef<string>>(ArgDialogRef);
  readonly data = inject(ARG_DIALOG_DATA) as { name: string };
}

@Component({ template: '<p>Sem título</p>' })
class UntitledDialog {}

describe('ArgDialog', () => {
  let opener: HTMLButtonElement;

  beforeEach(() => {
    opener = document.createElement('button');
    opener.textContent = 'Abrir';
    document.body.appendChild(opener);
    opener.focus();
  });

  afterEach(() => {
    TestBed.inject(ArgDialog).closeAll();
    opener.remove();
    jest.restoreAllMocks();
  });

  const dialogs = () =>
    Array.from(document.querySelectorAll<HTMLDialogElement>('dialog.arg-dialog'));
  const service = () => TestBed.inject(ArgDialog);
  const openEdit = (config = {}) =>
    service().open<EditDialog, { name: string }, string>(EditDialog, {
      data: { name: 'Thor' },
      ...config,
    });

  it('abre um <dialog> modal no body, com o componente e os dados', () => {
    openEdit();
    const [dialog] = dialogs();

    expect(dialog.parentElement).toBe(document.body);
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.querySelector('h2')?.textContent).toBe('Editar Thor');
  });

  it('foca o elemento marcado com arg-dialog-focus', () => {
    openEdit();
    expect(document.activeElement).toBe(dialogs()[0].querySelector('input'));
  });

  it('o título dá nome ao diálogo e a descrição é ligada', () => {
    openEdit();
    const [dialog] = dialogs();

    expect(accessibleName(dialog)).toBe('Editar Thor');
    const description = dialog.querySelector('p')!;
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
  });

  it('close(resultado) fecha, entrega o resultado e devolve o foco a quem abriu', async () => {
    const ref = openEdit();
    dialogs()[0].querySelector('input')!.focus();

    dialogs()[0].querySelector<HTMLButtonElement>('#salvar')!.click();

    expect(await ref.closed).toBe('Mel');
    expect(dialogs()).toHaveLength(0);
    expect(document.activeElement).toBe(opener);
  });

  it('Esc (evento cancel) fecha sem resultado', async () => {
    const ref = openEdit();
    const cancel = new Event('cancel', { cancelable: true });

    dialogs()[0].dispatchEvent(cancel);

    expect(await ref.closed).toBeUndefined();
    expect(cancel.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(opener);
  });

  it('clique no fundo fecha; clique dentro, não', async () => {
    const ref = openEdit();
    const [dialog] = dialogs();

    dialog.querySelector('input')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dialogs()).toHaveLength(1);

    // No jsdom a caixa do diálogo mede 0 × 0: qualquer ponto além dela é o fundo
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }));
    expect(await ref.closed).toBeUndefined();
  });

  it('dismissable: false ignora Esc e clique no fundo', () => {
    openEdit({ dismissable: false });
    const [dialog] = dialogs();

    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }));

    expect(dialogs()).toHaveLength(1);
  });

  it('label dá nome sem título; sem nenhum dos dois, avisa em desenvolvimento', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    service().open(UntitledDialog, { label: 'Detalhes' });
    expect(accessibleName(dialogs()[0])).toBe('Detalhes');
    expect(warn).not.toHaveBeenCalled();

    service().open(UntitledDialog);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('argDialogTitle'));
  });

  it('aplica o tamanho por classe', () => {
    openEdit({ size: 'lg' });
    expect(dialogs()[0].classList).toContain('arg-dialog--lg');
  });

  it('closeAll fecha todos', () => {
    openEdit();
    openEdit();
    expect(dialogs()).toHaveLength(2);

    service().closeAll();
    expect(dialogs()).toHaveLength(0);
  });

  it('não tem violações de acessibilidade', () => {
    openEdit();
    expect(a11yViolations(dialogs()[0])).toEqual([]);
  });

  describe('confirm()', () => {
    const buttons = () => Array.from(dialogs()[0].querySelectorAll<HTMLButtonElement>('button'));

    it('é um alertdialog com título e mensagem', () => {
      void service().confirm({ title: 'Enviar lembrete?', message: 'Maria recebe uma mensagem.' });
      const [dialog] = dialogs();

      expect(dialog.getAttribute('role')).toBe('alertdialog');
      expect(accessibleName(dialog)).toBe('Enviar lembrete?');
      expect(dialog.querySelector(`#${dialog.getAttribute('aria-describedby')}`)?.textContent).toBe(
        'Maria recebe uma mensagem.',
      );
      expect(buttons().map((b) => b.textContent?.trim())).toEqual(['Voltar', 'Confirmar']);
    });

    it('resolve true ao confirmar e false ao voltar ou com Esc', async () => {
      let answer = service().confirm({ title: 'Enviar?', confirmText: 'Enviar' });
      buttons()[1].click();
      expect(await answer).toBe(true);

      answer = service().confirm({ title: 'Enviar?' });
      buttons()[0].click();
      expect(await answer).toBe(false);

      answer = service().confirm({ title: 'Enviar?' });
      dialogs()[0].dispatchEvent(new Event('cancel', { cancelable: true }));
      expect(await answer).toBe(false);
    });

    it('com danger, o foco inicial fica em "Voltar" e o botão de confirmar é vermelho', () => {
      void service().confirm({ title: 'Excluir?', confirmText: 'Excluir', tone: 'danger' });
      const [back, confirm] = buttons();

      expect(document.activeElement).toBe(back);
      expect(confirm.hasAttribute('arg-dialog-focus')).toBe(false);
      expect(confirm.classList).toContain('arg-button--danger');
    });

    it('não tem violações de acessibilidade', () => {
      void service().confirm({ title: 'Excluir?', message: 'Não dá para desfazer.' });
      expect(a11yViolations(dialogs()[0])).toEqual([]);
    });
  });
});
