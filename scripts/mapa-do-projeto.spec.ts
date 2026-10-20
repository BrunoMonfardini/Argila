import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from '@jest/globals';

/** O mapa do projeto (docs/mapa-do-projeto.md) não pode envelhecer em silêncio. */
const MAP_FILE = 'docs/mapa-do-projeto.md';
const MAP = readFileSync(MAP_FILE, 'utf8');

/** Os links relativos do mapa (`](../caminho)`), sem âncora. */
const LINKS = [...MAP.matchAll(/\]\((\.\.\/[^)#\s]+)/g)].map((match) => match[1]);

/** Pastas que não são componentes: utilitários, tema e os design systems. */
const NOT_COMPONENTS = new Set(['internal', 'theme', 'design-systems']);

const COMPONENTS = globSync('projects/ui/src/lib/*/')
  .map((folder) => folder.replaceAll('\\', '/').replace(/\/$/, ''))
  .filter((folder) => !NOT_COMPONENTS.has(folder.split('/').pop()!));
const EXCLUSIVES = globSync('projects/ui/src/lib/design-systems/*/exclusivos/*/').map((folder) =>
  folder.replaceAll('\\', '/').replace(/\/$/, ''),
);

describe('mapa do projeto', () => {
  it('acha as pastas de componente e de exclusivo', () => {
    expect(COMPONENTS).toContain('projects/ui/src/lib/button');
    expect(EXCLUSIVES).toContain(
      'projects/ui/src/lib/design-systems/windows-xp/exclusivos/xp-window',
    );
  });

  it('tem um link para cada componente e cada exclusivo', () => {
    const linked = new Set(LINKS.map((link) => link.replace(/^\.\.\//, '')));
    const missing = [...COMPONENTS, ...EXCLUSIVES].filter((folder) => !linked.has(folder));

    expect(missing).toEqual([]);
  });

  it('todo link relativo aponta para um arquivo ou pasta que existe', () => {
    const base = dirname(resolve(MAP_FILE));
    const broken = LINKS.filter((link) => !existsSync(resolve(base, link)));

    expect(broken).toEqual([]);
  });
});
