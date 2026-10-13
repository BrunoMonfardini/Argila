import {
  addDays,
  addMonths,
  dateProblem,
  dayLabel,
  formatBr,
  isValidIso,
  maskBr,
  monthLabel,
  monthWeeks,
  parseBr,
  todayIso,
  weekday,
  weekdayNames,
} from './dates';

describe('datas', () => {
  it('validam datas que existem no calendário', () => {
    expect(isValidIso('2026-10-13')).toBe(true);
    expect(isValidIso('2028-02-29')).toBe(true);
    expect(isValidIso('2026-02-29')).toBe(false);
    expect(isValidIso('2026-13-01')).toBe(false);
    expect(isValidIso('13/10/2026')).toBe(false);
  });

  it('somam dias e meses, cruzando mês e ano', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addMonths('2026-10-13', 1)).toBe('2026-11-13');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-15');
    expect(addMonths('2026-03-31', -12)).toBe('2025-03-31');
  });

  it('não mudam o dia com horário de verão (fevereiro de 2019 no Brasil)', () => {
    expect(addDays('2019-02-16', 1)).toBe('2019-02-17');
    expect(addDays('2018-11-03', 1)).toBe('2018-11-04');
  });

  it('montam as semanas do mês de domingo a sábado', () => {
    // Outubro de 2026 começa numa quinta-feira e tem 31 dias
    expect(weekday('2026-10-01')).toBe(4);
    const weeks = monthWeeks('2026-10-13');
    expect(weeks).toHaveLength(5);
    expect(weeks[0]).toEqual([null, null, null, null, '2026-10-01', '2026-10-02', '2026-10-03']);
    expect(weeks[4]).toEqual([
      '2026-10-25',
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
    ]);
  });

  it('escrevem mês, dia e semana em português', () => {
    expect(monthLabel('2026-10-13')).toBe('outubro de 2026');
    expect(dayLabel('2026-10-13')).toBe('terça-feira, 13 de outubro de 2026');
    const names = weekdayNames();
    expect(names.map((n) => n.short)).toEqual(['D', 'S', 'T', 'Q', 'Q', 'S', 'S']);
    expect(names[0].long).toBe('domingo');
  });

  it('formatam, mascaram e leem a data no formato brasileiro', () => {
    expect(formatBr('2026-10-13')).toBe('13/10/2026');
    expect(formatBr(null)).toBe('');
    expect(maskBr('1310')).toBe('13/10');
    expect(maskBr('13102026999')).toBe('13/10/2026');
    expect(maskBr('ab')).toBe('');
    expect(parseBr('13/10/2026')).toBe('2026-10-13');
    expect(parseBr('13/10/20')).toBeNull();
    expect(parseBr('31/02/2026')).toBe('invalid');
  });

  it('dizem por que uma data não pode ser escolhida', () => {
    const sunday = (iso: string) => weekday(iso) === 0;
    const rules = { min: '2026-10-10', max: '2026-12-31', blocked: sunday };
    expect(dateProblem('2026-10-13', rules)).toBeNull();
    expect(dateProblem('2026-10-09', rules)).toBe('min');
    expect(dateProblem('2027-01-01', rules)).toBe('max');
    expect(dateProblem('2026-10-18', rules)).toBe('blocked');
    expect(dateProblem('2026-10-18', {})).toBeNull();
  });

  it('hoje no fuso de quem usa', () => {
    expect(todayIso(new Date(2026, 9, 13, 23, 59))).toBe('2026-10-13');
  });
});
