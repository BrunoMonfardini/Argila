import { IsoDate, addDays, weekday } from '../date-picker/dates';

/** Um agendamento. Datas e horas locais, sem fuso: "2026-10-13T14:00". */
export interface ArgAgendaEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  /** Linha menor, ex.: o pet e o tutor. */
  description?: string;
  /** Cor do agendamento: o padrão é a cor da marca. */
  tone?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

export type ArgAgendaView = 'day' | 'week';

/** Agendamento posicionado num dia: em que horário começa, quantos ocupa e em que faixa. */
export interface ArgPlacedEvent {
  event: ArgAgendaEvent;
  /** Índice do horário em que começa. */
  slot: number;
  /** Quantos horários ocupa (pelo menos 1). */
  span: number;
  /** Faixa (coluna) entre os agendamentos simultâneos, a partir de 0. */
  lane: number;
  /** Quantas faixas o grupo simultâneo tem. */
  lanes: number;
}

/** "14:30" em minutos desde a meia-noite. */
export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Minutos em "14:30". */
export function toTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

/** Horários da grade: de `start` até antes de `end`, de `step` em `step` minutos. */
export function timeSlots(start: string, end: string, step: number): string[] {
  const slots: string[] = [];
  for (let m = toMinutes(start); m < toMinutes(end); m += step) slots.push(toTime(m));
  return slots;
}

/** Dias mostrados: o próprio dia, ou a semana (de domingo a sábado) que o contém. */
export function visibleDays(date: IsoDate, view: ArgAgendaView): IsoDate[] {
  if (view === 'day') return [date];
  const sunday = addDays(date, -weekday(date));
  return Array.from({ length: 7 }, (_, i) => addDays(sunday, i));
}

/**
 * Agendamentos de um dia, posicionados na grade. Os simultâneos ficam lado a
 * lado: cada um na primeira faixa livre, e o grupo inteiro divide a largura.
 */
export function layoutDay(
  events: readonly ArgAgendaEvent[],
  day: IsoDate,
  start: string,
  end: string,
  step: number,
): ArgPlacedEvent[] {
  const first = toMinutes(start);
  const last = toMinutes(end);
  const today = events
    .filter((event) => event.start.slice(0, 10) === day)
    .map((event) => ({
      event,
      from: Math.max(toMinutes(event.start.slice(11, 16)), first),
      to: Math.min(toMinutes(event.end.slice(11, 16)), last),
    }))
    .filter((item) => item.to > item.from)
    .sort((a, b) => a.from - b.from || b.to - a.to);

  const placed: (ArgPlacedEvent & { to: number; group: number })[] = [];
  let laneEnds: number[] = [];
  let group = 0;
  let groupEnd = -1;
  for (const item of today) {
    // Começa um grupo novo quando nada do anterior ainda está acontecendo
    if (item.from >= groupEnd) {
      group++;
      laneEnds = [];
    }
    let lane = laneEnds.findIndex((endAt) => endAt <= item.from);
    if (lane < 0) lane = laneEnds.length;
    laneEnds[lane] = item.to;
    groupEnd = Math.max(groupEnd, item.to);
    placed.push({
      event: item.event,
      slot: Math.floor((item.from - first) / step),
      span: Math.max(1, Math.ceil((item.to - item.from) / step)),
      lane,
      lanes: 0,
      to: item.to,
      group,
    });
  }
  // Cada agendamento divide a largura com todo o seu grupo
  for (const item of placed) {
    item.lanes = Math.max(...placed.filter((p) => p.group === item.group).map((p) => p.lane)) + 1;
  }
  return placed.map(({ event, slot, span, lane, lanes }) => ({ event, slot, span, lane, lanes }));
}

const MONTH_DAY = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', timeZone: 'UTC' });
const FULL = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Período mostrado: "11 – 17 de outubro de 2026" (ou com os dois meses, se mudar). */
export function rangeLabel(days: readonly IsoDate[]): string {
  const toUtc = (iso: IsoDate) =>
    Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  const first = days[0];
  const last = days[days.length - 1];
  if (first === last) return FULL.format(toUtc(first));
  const sameMonth = first.slice(0, 7) === last.slice(0, 7);
  const start = sameMonth
    ? MONTH_DAY.format(toUtc(first))
    : FULL.format(toUtc(first)).replace(/ de \d{4}$/, '');
  return `${start} – ${FULL.format(toUtc(last))}`;
}
