import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { parseIcon } from './lib/icones.ts';

const root = resolve(import.meta.dirname, '..');
const iconsDir = resolve(root, 'projects/ui/icons');

/** Nomes do "Primeiro lote" na seção 1.2 do design system próprio. */
function firstBatch(): string[] {
  const doc = readFileSync(resolve(root, 'docs/design-system-proprio.md'), 'utf8');
  const section = doc.slice(
    doc.indexOf('#### Primeiro lote'),
    doc.indexOf('#### Do SVG ao código'),
  );
  return [...section.matchAll(/`([a-z0-9-]+)`/g)].map((match) => match[1]);
}

/** PR-07: o primeiro lote inteiro desenhado, no padrão e exportado. */
describe('primeiro lote de ícones', () => {
  it('a lista do documento tem os 44 ícones do lote', () => {
    expect(firstBatch()).toHaveLength(44);
  });

  it('cada ícone da lista tem o seu SVG e passa no padrão', () => {
    const files = new Set(readdirSync(iconsDir));
    const missing = firstBatch().filter((name) => !files.has(`${name}.svg`));
    const invalid = firstBatch()
      .filter((name) => files.has(`${name}.svg`))
      .filter((name) => {
        const svg = readFileSync(resolve(iconsDir, `${name}.svg`), 'utf8');
        try {
          parseIcon({ name, svg });
          return false;
        } catch {
          return true;
        }
      });

    expect(missing).toEqual([]);
    expect(invalid).toEqual([]);
  });

  it('cada ícone da lista está no código gerado', () => {
    const generated = readFileSync(
      resolve(root, 'projects/ui/src/lib/icon/icons.generated.ts'),
      'utf8',
    );
    for (const name of firstBatch()) expect(generated).toContain(`name: '${name}'`);
  });
});
