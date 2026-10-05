import { Params } from '@angular/router';
import { ManifestInput } from '../manifest';

export type PlaygroundValue = string | number | boolean | undefined;
export type PlaygroundValues = Record<string, PlaygroundValue>;

/** Inputs que o playground sabe controlar; tipos sem controle ficam de fora. */
export function controllableInputs(inputs: ManifestInput[]): ManifestInput[] {
  return inputs.filter((input) => input.control !== 'other');
}

/** Lê o valor padrão escrito em `input(...)` quando é um literal simples. */
export function parseDefault(input: ManifestInput): PlaygroundValue {
  const code = input.defaultValue?.trim();
  if (code === undefined) {
    return input.required && input.options ? input.options[0] : undefined;
  }
  if (code === 'true' || code === 'false') return code === 'true';
  if (/^-?\d+(\.\d+)?$/.test(code)) return Number(code);
  const quoted = /^(['"`])(.*)\1$/.exec(code);
  return quoted ? quoted[2] : undefined;
}

/** Valor de cada input: o padrão do código, sobrescrito pelo `playgroundInputs` da página. */
export function defaultValues(
  inputs: ManifestInput[],
  overrides: Record<string, unknown> = {},
): PlaygroundValues {
  const values: PlaygroundValues = {};
  for (const input of controllableInputs(inputs)) {
    const override = overrides[input.name];
    values[input.name] =
      override === undefined ? parseDefault(input) : (override as PlaygroundValue);
  }
  return values;
}

/** Converte um texto da URL no valor do tipo da input; texto inválido é ignorado. */
export function parseQueryValue(input: ManifestInput, raw: string): PlaygroundValue {
  switch (input.control) {
    case 'boolean':
      return raw === 'true' ? true : raw === 'false' ? false : undefined;
    case 'number': {
      const value = Number(raw);
      return raw.trim() && Number.isFinite(value) ? value : undefined;
    }
    case 'options':
      return input.options?.includes(raw) ? raw : undefined;
    default:
      return raw;
  }
}

/** Estado inicial: padrões, depois o que veio na URL. */
export function valuesFromQuery(
  inputs: ManifestInput[],
  defaults: PlaygroundValues,
  query: Params,
): PlaygroundValues {
  const values = { ...defaults };
  for (const input of controllableInputs(inputs)) {
    const raw = query[input.name];
    if (typeof raw !== 'string') continue;
    const value = parseQueryValue(input, raw);
    if (value !== undefined) values[input.name] = value;
  }
  return values;
}

/**
 * Parâmetros da URL para o estado atual: só o que difere do padrão, para o
 * link ficar curto. `null` remove o parâmetro (convenção do Router).
 */
export function queryFromValues(values: PlaygroundValues, defaults: PlaygroundValues): Params {
  const query: Params = {};
  for (const [name, value] of Object.entries(values)) {
    query[name] = value === defaults[name] || value === undefined ? null : String(value);
  }
  return query;
}

/** O primeiro seletor, sem a parte do atributo: `button[arg-button], a[...]` → `button` e `arg-button`. */
function parseSelector(selector: string): { tag: string; attribute?: string } {
  const first = selector.split(',')[0].trim();
  const match = /^([\w-]+)?(?:\[([\w-]+)\])?/.exec(first);
  return { tag: match?.[1] ?? 'div', attribute: match?.[2] };
}

function attribute(name: string, value: PlaygroundValue): string {
  if (value === true) return name;
  if (typeof value === 'string') return `${name}="${value}"`;
  return `[${name}]="${value}"`;
}

/** Código que reproduz o estado atual do playground, para copiar. */
export function playgroundSnippet(
  selector: string,
  values: PlaygroundValues,
  defaults: PlaygroundValues,
  content = '',
  required: string[] = [],
): string {
  const { tag, attribute: marker } = parseSelector(selector);
  const attrs = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== '')
    .filter(([name, value]) => required.includes(name) || value !== defaults[name])
    .filter(([, value]) => value !== false)
    .map(([name, value]) => attribute(name, value));
  // Valores que voltam a false precisam ser explícitos quando o padrão é true
  const explicitFalse = Object.entries(values)
    .filter(([name, value]) => value === false && defaults[name] === true)
    .map(([name]) => `[${name}]="false"`);
  const opening = [tag, marker, ...attrs, ...explicitFalse].filter(Boolean).join(' ');
  const isElementComponent = !marker;
  if (!content && isElementComponent) return `<${opening} />`;
  return `<${opening}>${content}</${tag}>`;
}
