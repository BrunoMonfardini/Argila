import { TestBed } from '@angular/core/testing';
import { ArgToast } from '@brunomonfardini/ui';
import { ToastBasicExample } from '../../../ui/src/lib/toast/examples/toast-basic.example';

/** O exemplo do Toast funciona de ponta a ponta. */
describe('exemplo do Toast', () => {
  const button = (root: ParentNode, text: string) =>
    Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
      (b) => b.textContent?.trim() === text,
    )!;
  const messages = () =>
    Array.from(document.querySelectorAll('arg-toast-stack .arg-toast__message')).map(
      (p) => p.textContent,
    );

  afterEach(() => TestBed.inject(ArgToast).dismissAll());

  it('mostra os três tipos de aviso e responde ao Desfazer', async () => {
    const fixture = TestBed.createComponent(ToastBasicExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Salvar agendamento').click();
    button(root, 'Simular erro').click();
    button(root, 'Remover pet').click();
    expect(messages()).toEqual([
      'Agendamento 1 salvo.',
      'Confira a conexão e tente de novo.',
      'Mel foi removida da lista.',
    ]);

    button(document.querySelector('arg-toast-stack')!, 'Desfazer').click();
    await fixture.whenStable();
    expect(root.querySelector('p')?.textContent).toBe('Mel voltou para a lista.');
  });

  it('sem Desfazer, confirma a remoção quando o aviso sai', async () => {
    const fixture = TestBed.createComponent(ToastBasicExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Remover pet').click();
    TestBed.inject(ArgToast).dismissAll();
    await fixture.whenStable();

    expect(root.querySelector('p')?.textContent).toBe('Remoção confirmada.');
  });
});
