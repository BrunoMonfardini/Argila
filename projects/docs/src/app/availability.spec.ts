import {
  PRODUCT_DESIGN_SYSTEMS,
  availabilityAcross,
  availabilityIn,
  coreComponentOf,
  pagesIn,
} from './availability';
import type { ManifestPage } from './manifest';
import type { DocPage } from './registry';

function page(slug: string, extra: Partial<DocPage> = {}): DocPage {
  return { slug, title: slug, category: 'Componentes', summary: '', examples: [], ...extra };
}

function generated(folder: string): ManifestPage {
  return {
    slug: folder,
    category: 'Componentes',
    file: `projects/ui/src/lib/${folder}/${folder}.docs.ts`,
    examples: {},
  };
}

describe('disponibilidade das páginas por design system', () => {
  it('acha o componente do núcleo pela pasta do *.docs.ts', () => {
    expect(coreComponentOf('projects/ui/src/lib/choice/choice.docs.ts')).toBe('choice');
    expect(coreComponentOf('projects/ui/src/patterns/loading.docs.ts')).toBeUndefined();
    expect(coreComponentOf('projects/ui/src/lib/nao-existe/nao-existe.docs.ts')).toBeUndefined();
    expect(coreComponentOf(undefined)).toBeUndefined();
  });

  it('curado, herdado e fora pelo manifesto do DS', () => {
    const agenda = page('agenda');

    expect(availabilityIn('punk', agenda, generated('agenda'))).toBe('curado');
    expect(availabilityIn('argila', agenda, generated('agenda'))).toBe('herdado');
    expect(availabilityIn('windows-xp', agenda, generated('agenda'))).toBe('fora');
  });

  it('exclusivo só no próprio DS; nos outros, fora', () => {
    const window = page('xp-window', { designSystem: 'windows-xp' });

    expect(availabilityIn('windows-xp', window, undefined)).toBe('exclusivo');
    expect(availabilityIn('punk', window, undefined)).toBe('fora');
  });

  it('páginas que não são de componente valem em todos', () => {
    expect(availabilityIn('windows-xp', page('carregamento'), undefined)).toBeUndefined();
  });

  it('"Disponível em" lista os DS de produto, sem os internos', () => {
    const across = availabilityAcross(page('agenda'), generated('agenda'));

    expect(PRODUCT_DESIGN_SYSTEMS.map((ds) => ds.id)).not.toContain('molde');
    expect(across.map((ds) => ds.id)).toEqual(PRODUCT_DESIGN_SYSTEMS.map((ds) => ds.id));
    expect(across.find((ds) => ds.id === 'windows-xp')).toEqual({
      id: 'windows-xp',
      name: 'Windows XP',
      status: 'fora',
    });
    expect(availabilityAcross(page('carregamento'), undefined)).toEqual([]);
  });

  it('a navegação de um DS esconde as páginas fora dele', () => {
    const pages = [
      page('agenda'),
      page('button'),
      page('xp-window', { designSystem: 'windows-xp' }),
      page('punk-burst', { designSystem: 'punk' }),
      page('carregamento', { category: 'Padrões' }),
    ];
    const visible = (style: Parameters<typeof pagesIn>[0]) =>
      pagesIn(style, pages, (p) => (p.designSystem ? undefined : generated(p.slug))).map(
        (p) => p.slug,
      );

    expect(visible('windows-xp')).toEqual(['button', 'xp-window', 'carregamento']);
    expect(visible('punk')).toEqual(['agenda', 'button', 'punk-burst', 'carregamento']);
  });
});
