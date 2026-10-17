import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import {
  ARG_COMPONENTS,
  ARG_CORE_MINIMUM,
} from '../projects/ui/src/lib/design-systems/design-system.ts';
import { coreCssViolations, exclusiveViolations, skinViolations } from './lib/arquitetura.ts';
import {
  DESIGN_SYSTEMS_SOURCE,
  DESIGN_SYSTEMS_TOKENS,
  loadDesignSystems,
  rootSelector,
} from './lib/design-systems.ts';

/**
 * Regras de arquitetura que olham o conteúdo dos arquivos (seção 5 da
 * especificação dos design systems). As de import ficam no dependency-cruiser
 * (`pnpm arch:check`).
 */

const ROOT = resolve(import.meta.dirname, '..');
const LIB = resolve(ROOT, 'projects/ui/src/lib');
/** Pastas de src/lib/ que não são componentes do núcleo. */
const NOT_COMPONENTS = ['design-systems', 'internal', 'theme'];

function files(dir: string, extension: string) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith(extension))
    .map((file) => ({
      path: relative(ROOT, resolve(dir, file)).replace(/\\/g, '/'),
      text: readFileSync(resolve(dir, file), 'utf8'),
    }));
}

const folders = (dir: string) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];

const designSystems = await loadDesignSystems(ROOT);

describe('núcleo', () => {
  it('ARG_COMPONENTS lista cada pasta de componente em src/lib/', () => {
    const components = folders(LIB).filter((name) => !NOT_COMPONENTS.includes(name));

    expect([...ARG_COMPONENTS].sort()).toEqual(components.sort());
  });

  it('o núcleo mínimo só tem componentes que existem', () => {
    expect(ARG_CORE_MINIMUM.filter((name) => !ARG_COMPONENTS.includes(name))).toEqual([]);
  });

  it('o CSS dos componentes só usa tokens: sem cor literal e sem seletor de design system', () => {
    const core = folders(LIB)
      .filter((name) => name !== 'design-systems')
      .flatMap((name) => files(resolve(LIB, name), '.css'));

    expect(core.length).toBeGreaterThan(0);
    expect(coreCssViolations(core)).toEqual([]);
  });
});

describe.each(designSystems.map((ds) => [ds.id, ds] as const))('design system %s', (id, ds) => {
  it('pele: um arquivo por componente curado, preso ao design system', () => {
    const skins = files(resolve(ROOT, DESIGN_SYSTEMS_TOKENS, id, 'componentes'), '.css');

    expect(skinViolations(ds, skins, rootSelector(id))).toEqual([]);
  });

  it('quem cura algum componente cura todo o núcleo mínimo', () => {
    const missing = ds.componentes.curados.length
      ? ARG_CORE_MINIMUM.filter((name) => !ds.componentes.curados.includes(name))
      : [];

    expect(missing).toEqual([]);
  });

  it('exclusivos: prefixo, pasta e seletor', () => {
    const dir = resolve(ROOT, DESIGN_SYSTEMS_SOURCE, id, 'exclusivos');

    expect(exclusiveViolations(ds, folders(dir), files(dir, '.ts'))).toEqual([]);
  });
});
