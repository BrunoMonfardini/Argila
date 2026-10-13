/**
 * Datas como texto ISO (`2026-10-13`), sem horário nem fuso: o que importa
 * num agendamento é o dia. As contas usam UTC por dentro, para o horário de
 * verão e o fuso de quem usa não mudarem o dia.
 */
export type IsoDate = string;

const DAY_MS = 86_400_000;
const LOCALE = 'pt-BR';

function toUtc(iso: IsoDate): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUtc(time: number): IsoDate {
  return new Date(time).toISOString().slice(0, 10);
}

/** A data existe no calendário (ex.: 30/02 não existe). */
export function isValidIso(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return fromUtc(toUtc(iso)) === iso;
}

/** Hoje, no fuso de quem usa. */
export function todayIso(now = new Date()): IsoDate {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  return fromUtc(toUtc(iso) + days * DAY_MS);
}

/** Mesmo dia em outro mês; sem esse dia (31/01 + 1 mês), o último dia do mês. */
export function addMonths(iso: IsoDate, months: number): IsoDate {
  const [y, m, d] = iso.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
  ).getUTCDate();
  first.setUTCDate(Math.min(d, lastDay));
  return fromUtc(first.getTime());
}

/** Dia da semana: 0 é domingo. */
export function weekday(iso: IsoDate): number {
  return new Date(toUtc(iso)).getUTCDay();
}

/** Semanas do mês (domingo a sábado); `null` nos dias de fora do mês. */
export function monthWeeks(iso: IsoDate): (IsoDate | null)[][] {
  const first = `${iso.slice(0, 7)}-01`;
  const days: (IsoDate | null)[] = Array(weekday(first)).fill(null);
  for (let day = first; day.slice(0, 7) === first.slice(0, 7); day = addDays(day, 1))
    days.push(day);
  while (days.length % 7) days.push(null);
  const weeks: (IsoDate | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

/** "outubro de 2026". */
export function monthLabel(iso: IsoDate): string {
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(toUtc(iso));
}

/** "terça-feira, 13 de outubro de 2026": nome de cada dia para o leitor de tela. */
export function dayLabel(iso: IsoDate): string {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: 'full', timeZone: 'UTC' }).format(toUtc(iso));
}

/** Iniciais e nomes dos dias da semana, de domingo a sábado. */
export function weekdayNames(): { short: string; long: string }[] {
  const sunday = Date.UTC(2026, 0, 4);
  return Array.from({ length: 7 }, (_, i) => {
    const date = sunday + i * DAY_MS;
    const format = (weekday: 'narrow' | 'long') =>
      new Intl.DateTimeFormat(LOCALE, { weekday, timeZone: 'UTC' }).format(date);
    return { short: format('narrow').toUpperCase(), long: format('long') };
  });
}

/** ISO em "13/10/2026". */
export function formatBr(iso: IsoDate | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Máscara enquanto digita: "1310" → "13/10", "13102026" → "13/10/2026". */
export function maskBr(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
}

/**
 * "13/10/2026" em ISO. Devolve `null` se ainda não tem os 8 dígitos e
 * `'invalid'` se tem, mas a data não existe.
 */
export function parseBr(text: string): IsoDate | null | 'invalid' {
  const digits = text.replace(/\D/g, '');
  if (digits.length < 8) return null;
  const iso = `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
  return isValidIso(iso) ? iso : 'invalid';
}

/** Regras de datas permitidas: limites e dias bloqueados. */
export interface ArgDateRules {
  /** Primeira data permitida (ISO). */
  min?: IsoDate | null;
  /** Última data permitida (ISO). */
  max?: IsoDate | null;
  /** Dias bloqueados, ex.: domingos e feriados. */
  blocked?: ((date: IsoDate) => boolean) | null;
}

/** Por que a data não pode ser escolhida, ou `null` se pode. */
export function dateProblem(iso: IsoDate, rules: ArgDateRules): 'min' | 'max' | 'blocked' | null {
  if (rules.min && iso < rules.min) return 'min';
  if (rules.max && iso > rules.max) return 'max';
  if (rules.blocked?.(iso)) return 'blocked';
  return null;
}
