import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../testing/a11y';
import { ArgAnnouncer } from '../internal/announcer';
import { ArgToast } from './toast';

describe('ArgToast', () => {
  let toast: ArgToast;
  let announce: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    toast = TestBed.inject(ArgToast);
    announce = vi
      .spyOn(TestBed.inject(ArgAnnouncer), 'announce')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    toast.dismissAll();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const stack = () => document.querySelector<HTMLElement>('arg-toast-stack')!;
  const messages = () =>
    Array.from(stack().querySelectorAll('.arg-toast__message')).map((p) => p.textContent);
  const button = (text: string) =>
    Array.from(stack().querySelectorAll<HTMLButtonElement>('button')).find(
      (b) => b.textContent?.trim() === text || b.getAttribute('aria-label') === text,
    )!;

  it('mostra o aviso numa pilha com nome, no body', () => {
    toast.show('Agendamento salvo', { tone: 'success', title: 'Pronto' });

    expect(stack().parentElement).toBe(document.body);
    expect(stack().getAttribute('role')).toBe('region');
    expect(stack().getAttribute('aria-label')).toBe('Notificações');
    expect(stack().getAttribute('popover')).toBe('manual');
    expect(messages()).toEqual(['Agendamento salvo']);
    expect(stack().querySelector('.arg-toast')!.classList).toContain('arg-toast--success');
    expect(stack().querySelector('.arg-toast__title')?.textContent).toBe('Pronto');
  });

  it('anuncia pelo leitor de tela: educado para info e sucesso, interrompendo para aviso e erro', () => {
    toast.show('Salvo', { tone: 'success' });
    toast.show('Não salvou', { tone: 'danger', title: 'Erro' });

    expect(announce).toHaveBeenNthCalledWith(1, 'Salvo', 'polite');
    expect(announce).toHaveBeenNthCalledWith(2, 'Erro. Não salvou', 'assertive');
  });

  it('avisos que entram juntos são anunciados juntos, sem perder nenhum', () => {
    toast.show('Agendamento salvo.');
    toast.show('Lembrete enviado');
    toast.show('Pet atualizado');
    expect(announce).toHaveBeenLastCalledWith(
      'Agendamento salvo. Lembrete enviado. Pet atualizado',
      'polite',
    );

    // Os três saem depois de 5 s; um aviso novo, bem depois, é anunciado sozinho
    vi.advanceTimersByTime(6000);
    toast.show('Outro');
    expect(announce).toHaveBeenLastCalledWith('Outro', 'polite');
  });

  it('a pilha não é região viva: o anúncio não é lido duas vezes', () => {
    toast.show('Salvo');
    expect(stack().hasAttribute('aria-live')).toBe(false);
    expect(stack().querySelector('[aria-live], [role="status"], [role="alert"]')).toBeNull();
  });

  it('some depois de 5 s, ou 8 s com ação', async () => {
    const plain = toast.show('Salvo');
    const withAction = toast.show('Removido', {
      action: { label: 'Desfazer', run: () => undefined },
    });

    vi.advanceTimersByTime(5000);
    expect(await plain.dismissed).toBe('timeout');
    expect(messages()).toEqual(['Removido']);

    vi.advanceTimersByTime(3000);
    expect(await withAction.dismissed).toBe('timeout');
    expect(messages()).toEqual([]);
  });

  it('duration 0 fica até fechar', () => {
    toast.show('Erro', { duration: 0 });
    vi.advanceTimersByTime(60_000);
    expect(messages()).toEqual(['Erro']);
  });

  it('fila: até 3 na tela; o próximo entra quando um sai', () => {
    const refs = ['1', '2', '3', '4'].map((n) => toast.show(n));
    expect(messages()).toEqual(['1', '2', '3']);
    expect(announce).toHaveBeenCalledTimes(3);

    vi.advanceTimersByTime(1000);
    refs[1].dismiss();
    expect(messages()).toEqual(['1', '3', '4']);
    expect(announce).toHaveBeenLastCalledWith('4', 'polite');
  });

  it('dismiss de um aviso ainda na fila tira ele da fila', async () => {
    const refs = ['1', '2', '3', '4'].map((n) => toast.show(n));
    refs[3].dismiss();
    expect(await refs[3].dismissed).toBe('close');

    refs[0].dismiss();
    expect(messages()).toEqual(['2', '3']);
  });

  it('pausa com o mouse em cima e continua de onde parou', () => {
    toast.show('Salvo');
    vi.advanceTimersByTime(3000);

    stack().dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(10_000);
    expect(messages()).toEqual(['Salvo']);

    stack().dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(1999);
    expect(messages()).toEqual(['Salvo']);
    vi.advanceTimersByTime(1);
    expect(messages()).toEqual([]);
  });

  it('pausa com o foco dentro; sair do foco para outro botão do aviso não retoma', () => {
    toast.show('Removido', { action: { label: 'Desfazer', run: () => undefined } });
    const close = button('Fechar notificação');

    close.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    vi.advanceTimersByTime(20_000);
    expect(messages()).toEqual(['Removido']);

    close.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: button('Desfazer') }),
    );
    vi.advanceTimersByTime(20_000);
    expect(messages()).toEqual(['Removido']);

    close.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    vi.advanceTimersByTime(8000);
    expect(messages()).toEqual([]);
  });

  it('a ação roda, fecha o aviso e informa o motivo', async () => {
    const run = vi.fn();
    const ref = toast.show('Removido', { action: { label: 'Desfazer', run } });

    button('Desfazer').click();

    expect(run).toHaveBeenCalledTimes(1);
    expect(await ref.dismissed).toBe('action');
    expect(messages()).toEqual([]);
  });

  it('o botão de fechar tira o aviso', async () => {
    const ref = toast.show('Salvo');
    button('Fechar notificação').click();
    expect(await ref.dismissed).toBe('close');
  });

  it('não tem violações de acessibilidade', () => {
    toast.show('Removido', {
      title: 'Pet',
      tone: 'warning',
      action: { label: 'Desfazer', run: () => undefined },
    });
    expect(a11yViolations(stack())).toEqual([]);
  });
});
