import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from '@jest/globals';
import { ARG_CORE_MINIMUM } from '../projects/ui/src/lib/design-systems/design-system.ts';

/** Os componentes do núcleo que um arquivo importa (`../../lib/<nome>/…`). */
function coreImports(source: string): string[] {
  return [...source.matchAll(/from '(?:\.\.\/)+lib\/([\w-]+)\//g)].map((match) => match[1]);
}

const files = (folder: string) =>
  globSync(`projects/ui/src/${folder}/**/*.ts`).filter((file) => !file.endsWith('.spec.ts'));
const TEMPLATES = files('templates');
const PATTERNS = files('patterns');
const FILES = [...TEMPLATES, ...PATTERNS];

describe('templates e padrões', () => {
  it('existem os cinco templates da 4.6 e os 18 padrões das levas 1 e 2', () => {
    expect(TEMPLATES.filter((file) => file.endsWith('.docs.ts')).length).toBe(5);
    expect(PATTERNS.filter((file) => file.endsWith('.docs.ts')).length).toBe(18);
  });

  it('acha os componentes importados', () => {
    expect(coreImports("import { ArgButton } from '../../lib/button/button';")).toEqual(['button']);
  });

  // Só o núcleo mínimo: todo design system o cura, então o template e o padrão funcionam em todos
  it.each(FILES)('%s usa só componentes do núcleo mínimo', (file) => {
    const core: readonly string[] = ARG_CORE_MINIMUM;
    const outside = coreImports(readFileSync(file, 'utf8')).filter((name) => !core.includes(name));

    expect(outside).toEqual([]);
  });
});
