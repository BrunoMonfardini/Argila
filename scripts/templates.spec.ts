import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from '@jest/globals';
import { ARG_CORE_MINIMUM } from '../projects/ui/src/lib/design-systems/design-system.ts';

/** Os componentes do núcleo que um arquivo importa (`../../lib/<nome>/…`). */
function coreImports(source: string): string[] {
  return [...source.matchAll(/from '(?:\.\.\/)+lib\/([\w-]+)\//g)].map((match) => match[1]);
}

const FILES = globSync('projects/ui/src/templates/**/*.ts').filter(
  (file) => !file.endsWith('.spec.ts'),
);

describe('templates', () => {
  it('existem os cinco templates da 4.6', () => {
    expect(FILES.filter((file) => file.endsWith('.docs.ts')).length).toBe(5);
  });

  it('acha os componentes importados', () => {
    expect(coreImports("import { ArgButton } from '../../lib/button/button';")).toEqual(['button']);
  });

  // Só o núcleo mínimo: todo design system o cura, então o template funciona em todos
  it.each(FILES)('%s usa só componentes do núcleo mínimo', (file) => {
    const core: readonly string[] = ARG_CORE_MINIMUM;
    const outside = coreImports(readFileSync(file, 'utf8')).filter((name) => !core.includes(name));

    expect(outside).toEqual([]);
  });
});
