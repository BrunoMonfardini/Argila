import { TestBed } from '@angular/core/testing';
import { ArgDialog } from '@brunomonfardini/ui';
import { DialogConfirmExample } from '../../../ui/src/lib/dialog/examples/dialog-confirm.example';
import { DialogFormExample } from '../../../ui/src/lib/dialog/examples/dialog-form.example';

/** Os exemplos do Dialog funcionam de ponta a ponta: abrem, devolvem o resultado e atualizam a tela. */
describe('exemplos do Dialog', () => {
  const dialog = () => document.querySelector<HTMLDialogElement>('dialog.arg-dialog');
  const button = (root: ParentNode, text: string) =>
    Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
      (b) => b.textContent?.trim() === text,
    )!;

  afterEach(() => TestBed.inject(ArgDialog).closeAll());

  it('Formulário: edita o nome do pet e devolve o resultado', async () => {
    const fixture = TestBed.createComponent(DialogFormExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Editar pet').click();
    const input = dialog()!.querySelector('input')!;
    expect(document.activeElement).toBe(input);
    input.value = 'Thor Jr.';
    input.dispatchEvent(new Event('input'));
    dialog()!
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();

    expect(dialog()).toBeNull();
    expect(root.querySelector('strong')?.textContent).toBe('Thor Jr.');
  });

  it('Formulário: Voltar fecha sem mudar nada', async () => {
    const fixture = TestBed.createComponent(DialogFormExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Editar pet').click();
    button(dialog()!, 'Voltar').click();
    await fixture.whenStable();

    expect(root.querySelector('strong')?.textContent).toBe('Thor');
  });

  it('Confirmação: mostra o que aconteceu em cada resposta', async () => {
    const fixture = TestBed.createComponent(DialogConfirmExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const said = () => root.querySelector('[role="status"]')?.textContent;

    button(root, 'Cancelar agendamento').click();
    button(dialog()!, 'Cancelar agendamento').click();
    await fixture.whenStable();
    expect(said()).toBe('Agendamento cancelado.');

    button(root, 'Enviar lembrete').click();
    button(dialog()!, 'Voltar').click();
    await fixture.whenStable();
    expect(said()).toBe('Nada mudou.');
  });
});
