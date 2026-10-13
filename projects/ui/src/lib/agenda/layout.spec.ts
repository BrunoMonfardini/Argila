import {
  ArgAgendaEvent,
  layoutDay,
  rangeLabel,
  timeSlots,
  toMinutes,
  toTime,
  visibleDays,
} from './layout';

const event = (id: string, start: string, end: string): ArgAgendaEvent => ({
  id,
  title: id,
  start: `2026-10-13T${start}`,
  end: `2026-10-13T${end}`,
});

describe('leiaute da agenda', () => {
  it('converte horários e monta a grade', () => {
    expect(toMinutes('14:30')).toBe(870);
    expect(toTime(870)).toBe('14:30');
    expect(timeSlots('08:00', '10:00', 30)).toEqual(['08:00', '08:30', '09:00', '09:30']);
  });

  it('mostra o dia ou a semana de domingo a sábado', () => {
    expect(visibleDays('2026-10-13', 'day')).toEqual(['2026-10-13']);
    const week = visibleDays('2026-10-13', 'week');
    expect(week[0]).toBe('2026-10-11');
    expect(week[6]).toBe('2026-10-17');
  });

  it('posiciona pelo horário de início e pela duração', () => {
    const [placed] = layoutDay(
      [event('banho', '09:00', '10:30')],
      '2026-10-13',
      '08:00',
      '18:00',
      30,
    );
    expect(placed).toMatchObject({ slot: 2, span: 3, lane: 0, lanes: 1 });
  });

  it('agendamentos simultâneos ficam lado a lado; os de depois voltam à largura toda', () => {
    const placed = layoutDay(
      [
        event('a', '09:00', '10:00'),
        event('b', '09:30', '10:30'),
        event('c', '09:30', '10:00'),
        event('d', '11:00', '12:00'),
      ],
      '2026-10-13',
      '08:00',
      '18:00',
      30,
    );
    const by = (id: string) => placed.find((p) => p.event.id === id)!;
    expect(by('a')).toMatchObject({ lane: 0, lanes: 3 });
    expect(by('b')).toMatchObject({ lane: 1, lanes: 3 });
    expect(by('c')).toMatchObject({ lane: 2, lanes: 3 });
    expect(by('d')).toMatchObject({ lane: 0, lanes: 1 });
  });

  it('reaproveita a faixa que já terminou dentro do mesmo grupo', () => {
    const placed = layoutDay(
      [event('a', '09:00', '11:00'), event('b', '09:00', '09:30'), event('c', '10:00', '10:30')],
      '2026-10-13',
      '08:00',
      '18:00',
      30,
    );
    expect(placed.find((p) => p.event.id === 'c')).toMatchObject({ lane: 1, lanes: 2 });
  });

  it('corta o que passa do horário da grade e ignora outros dias', () => {
    const placed = layoutDay(
      [
        event('cedo', '07:00', '08:30'),
        { id: 'amanha', title: 'x', start: '2026-10-14T09:00', end: '2026-10-14T10:00' },
        event('fora', '06:00', '07:00'),
      ],
      '2026-10-13',
      '08:00',
      '18:00',
      30,
    );
    expect(placed.map((p) => p.event.id)).toEqual(['cedo']);
    expect(placed[0]).toMatchObject({ slot: 0, span: 1 });
  });

  it('escreve o período em português', () => {
    expect(rangeLabel(['2026-10-13'])).toBe('13 de outubro de 2026');
    expect(rangeLabel(visibleDays('2026-10-13', 'week'))).toBe('11 – 17 de outubro de 2026');
    // Semana que cruza meses
    expect(rangeLabel(visibleDays('2026-10-01', 'week'))).toBe(
      '27 de setembro – 3 de outubro de 2026',
    );
    expect(rangeLabel(visibleDays('2026-11-02', 'week'))).toBe('1 – 7 de novembro de 2026');
  });
});
