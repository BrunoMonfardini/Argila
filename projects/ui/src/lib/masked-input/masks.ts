/** Documentos e contatos brasileiros com máscara. */
export type ArgMaskKind = 'cpf' | 'cnpj' | 'cep' | 'phone';

interface MaskSpec {
  /** Caracteres que contam (os outros são da máscara). */
  allowed: RegExp;
  /** Quantidades de caracteres aceitas; a última é o máximo. */
  lengths: readonly number[];
  /** `#` é um caractere digitado; o resto é fixo. Escolhido pelo tamanho. */
  pattern: (length: number) => string;
}

const MASKS: Record<ArgMaskKind, MaskSpec> = {
  cpf: { allowed: /\d/, lengths: [11], pattern: () => '###.###.###-##' },
  // CNPJ alfanumérico (Receita Federal, 2026): letras nas 12 primeiras posições
  cnpj: { allowed: /[0-9A-Z]/, lengths: [14], pattern: () => '##.###.###/####-##' },
  cep: { allowed: /\d/, lengths: [8], pattern: () => '#####-###' },
  // Fixo com 10 dígitos, celular com 11
  phone: {
    allowed: /\d/,
    lengths: [10, 11],
    pattern: (length) => (length > 10 ? '(##) #####-####' : '(##) ####-####'),
  },
};

/** Tira a máscara: só os caracteres que contam, em maiúsculas, até o máximo do tipo. */
export function unmask(kind: ArgMaskKind, text: string): string {
  const { allowed, lengths } = MASKS[kind];
  const max = lengths[lengths.length - 1];
  return [...text.toUpperCase()]
    .filter((char) => allowed.test(char))
    .join('')
    .slice(0, max);
}

/** Põe a máscara no valor limpo, até onde ele vai: "1234" → "123.4" no CPF. */
export function applyMask(kind: ArgMaskKind, raw: string): string {
  const value = unmask(kind, raw);
  const pattern = MASKS[kind].pattern(value.length);
  let out = '';
  let index = 0;
  for (const slot of pattern) {
    if (index >= value.length) break;
    if (slot === '#') out += value[index++];
    else out += slot;
  }
  return out;
}

/** O valor limpo tem uma quantidade válida de caracteres para o tipo. */
export function isComplete(kind: ArgMaskKind, raw: string): boolean {
  return MASKS[kind].lengths.includes(raw.length);
}

/**
 * Posição do cursor depois de reformatar: logo após o `count`-ésimo
 * caractere que conta, para quem edita no meio do texto não ver o cursor pular.
 */
export function caretAfter(kind: ArgMaskKind, masked: string, count: number): number {
  if (count <= 0) return 0;
  const { allowed } = MASKS[kind];
  let seen = 0;
  for (let i = 0; i < masked.length; i++) {
    if (allowed.test(masked[i]) && ++seen === count) return i + 1;
  }
  return masked.length;
}

/** Quantos caracteres que contam há antes da posição `caret` do texto. */
export function significantBefore(kind: ArgMaskKind, text: string, caret: number): number {
  return unmask(kind, text.slice(0, caret)).length;
}

function allSame(value: string): boolean {
  return [...value].every((char) => char === value[0]);
}

/** Dígito verificador no padrão módulo 11 da Receita Federal. */
function checkDigit(values: readonly number[], weights: readonly number[]): number {
  const sum = values.reduce((total, value, i) => total + value * weights[i], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/** CPF com 11 dígitos e os dois dígitos verificadores certos. */
export function isValidCpf(value: string): boolean {
  if (!/^\d{11}$/.test(value) || allSame(value)) return false;
  const digits = [...value].map(Number);
  const first = checkDigit(digits.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(digits.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return first === digits[9] && second === digits[10];
}

/**
 * CNPJ numérico ou alfanumérico (12 caracteres de 0-9 ou A-Z e 2 dígitos
 * verificadores). Cada caractere vale o código ASCII menos 48: "0" vale 0,
 * "A" vale 17.
 */
export function isValidCnpj(value: string): boolean {
  const cnpj = value.toUpperCase();
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || allSame(cnpj)) return false;
  const values = [...cnpj].map((char) => char.charCodeAt(0) - 48);
  const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const first = checkDigit(values.slice(0, 12), weights.slice(1));
  const second = checkDigit(values.slice(0, 13), weights);
  return first === values[12] && second === values[13];
}

/** CEP com 8 dígitos. */
export function isValidCep(value: string): boolean {
  return /^\d{8}$/.test(value);
}

/**
 * Telefone com DDD: fixo com 10 dígitos ou celular com 11 (o número começa
 * com 9). O DDD não tem zero (11 a 99).
 */
export function isValidPhone(value: string): boolean {
  if (!/^[1-9][1-9]\d{8,9}$/.test(value)) return false;
  return value.length === 10 || value[2] === '9';
}

/** Validação completa de cada tipo. */
export const ARG_MASK_VALIDATORS: Record<ArgMaskKind, (value: string) => boolean> = {
  cpf: isValidCpf,
  cnpj: isValidCnpj,
  cep: isValidCep,
  phone: isValidPhone,
};
