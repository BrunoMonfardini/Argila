/** Regras de um campo de arquivo. */
export interface ArgFileRules {
  /** Tipos aceitos, como no `accept` do `<input>`: "image/*,.pdf". Vazio aceita tudo. */
  accept?: string;
  /** Tamanho máximo de cada arquivo, em bytes. */
  maxSize?: number | null;
}

const SIZE = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

/** Tamanho legível: 1536 → "1,5 KB", 5 * 1024 * 1024 → "5 MB". */
export function formatSize(bytes: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${SIZE.format(value)} ${units[unit]}`;
}

/**
 * O arquivo combina com o `accept`: extensão (".pdf"), tipo exato
 * ("application/pdf") ou curinga ("image/*").
 */
export function acceptsType(file: Pick<File, 'name' | 'type'>, accept = ''): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/** Lista legível do `accept` para a mensagem de erro: "image/*,.pdf" → "imagens, PDF". */
export function describeAccept(accept = ''): string {
  const names = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
    .map((rule) => {
      if (rule === 'image/*') return 'imagens';
      if (rule === 'video/*') return 'vídeos';
      if (rule === 'audio/*') return 'áudios';
      if (rule.startsWith('.')) return rule.slice(1).toUpperCase();
      return rule.split('/').pop()!.toUpperCase();
    });
  return [...new Set(names)].join(', ');
}

/** Por que o arquivo não é aceito, em texto para a pessoa; `null` se é aceito. */
export function fileProblem(
  file: Pick<File, 'name' | 'type' | 'size'>,
  rules: ArgFileRules,
): string | null {
  if (!acceptsType(file, rules.accept)) {
    return `Tipo não aceito. Use ${describeAccept(rules.accept)}.`;
  }
  if (rules.maxSize && file.size > rules.maxSize) {
    return `Arquivo maior que ${formatSize(rules.maxSize)}.`;
  }
  return null;
}
