import { TestBed } from '@angular/core/testing';
import { ArgAnnouncer } from './announcer';

describe('ArgAnnouncer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function regions() {
    return Array.from(document.querySelectorAll<HTMLElement>('.arg-announcer'));
  }

  it('cria a região na primeira mensagem, escondida da tela e com aria-live', () => {
    const announcer = TestBed.inject(ArgAnnouncer);
    expect(regions()).toEqual([]);

    announcer.announce('Agendamento salvo');

    const [region] = regions();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(region.style.position).toBe('absolute');
    expect(region.style.width).toBe('1px');
  });

  it('escreve a mensagem depois de limpar, para repetir o mesmo aviso', () => {
    const announcer = TestBed.inject(ArgAnnouncer);
    announcer.announce('Salvo');
    vi.advanceTimersByTime(100);
    const [region] = regions();
    expect(region.textContent).toBe('Salvo');

    announcer.announce('Salvo');

    expect(region.textContent).toBe('');
    vi.advanceTimersByTime(100);
    expect(region.textContent).toBe('Salvo');
  });

  it('a última mensagem vence quando chegam várias juntas', () => {
    const announcer = TestBed.inject(ArgAnnouncer);

    announcer.announce('Primeira');
    announcer.announce('Segunda');
    vi.advanceTimersByTime(100);

    expect(regions()[0].textContent).toBe('Segunda');
  });

  it('usa uma região assertiva separada para erros, reaproveitada depois', () => {
    const announcer = TestBed.inject(ArgAnnouncer);

    announcer.announce('Horário indisponível', 'assertive');
    announcer.announce('Outro erro', 'assertive');
    vi.advanceTimersByTime(100);

    const [region] = regions();
    expect(regions()).toHaveLength(1);
    expect(region.getAttribute('aria-live')).toBe('assertive');
    expect(region.getAttribute('role')).toBe('alert');
    expect(region.textContent).toBe('Outro erro');
  });

  it('limpa as mensagens pendentes e as já escritas', () => {
    const announcer = TestBed.inject(ArgAnnouncer);
    announcer.announce('Escrita');
    vi.advanceTimersByTime(100);
    announcer.announce('Pendente', 'assertive');

    announcer.clear();
    vi.advanceTimersByTime(100);

    expect(regions().map((region) => region.textContent)).toEqual(['', '']);
  });

  it('remove as regiões quando a aplicação é destruída', () => {
    TestBed.inject(ArgAnnouncer).announce('Tchau');
    expect(regions()).toHaveLength(1);

    TestBed.resetTestingModule();

    expect(regions()).toEqual([]);
  });
});
