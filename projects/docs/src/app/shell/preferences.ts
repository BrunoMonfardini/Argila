/**
 * Preferências do catálogo no navegador. O armazenamento pode estar bloqueado
 * (modo privado, política do navegador): nesse caso o catálogo só não lembra.
 */
export function readPreference<T extends string>(
  key: string,
  allowed: readonly { value: T }[],
): T | undefined {
  try {
    const value = localStorage.getItem(key);
    return allowed.find((option) => option.value === value)?.value;
  } catch {
    return undefined;
  }
}

export function writePreference(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Sem armazenamento, a escolha vale só até recarregar a página.
  }
}
