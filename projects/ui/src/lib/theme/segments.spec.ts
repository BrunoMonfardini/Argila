import { jest } from '@jest/globals';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideArgila } from './provide-argila';
import { type ArgSegment, argSegmentAttributes } from './segments';
import { ArgTheme } from './theme';

const SEGMENTS = {
  essencial: { style: 'argila' },
  premium: {
    style: 'argila',
    palette: 'terrosa',
    scheme: 'dark',
    colors: { accent: 'caramelo' },
  },
  vidro: { style: 'transparente', palette: 'oceano', surfaceOpacity: 0.6 },
} satisfies Record<string, ArgSegment>;

// O tipo recusa paleta que o design system não aceita (o Windows XP não aceita a Terrosa)
// @ts-expect-error a Terrosa não está nas paletas do Windows XP
const INVALID: ArgSegment = { style: 'windows-xp', palette: 'terrosa' };

describe('segmentos', () => {
  const root = document.documentElement;

  afterEach(() => {
    for (const name of [
      'data-arg-style',
      'data-arg-palette',
      'data-arg-theme',
      'data-arg-segment',
      'data-arg-primary',
      'data-arg-secondary',
      'data-arg-accent',
    ]) {
      root.removeAttribute(name);
    }
    root.style.removeProperty('--arg-surface-opacity');
    jest.restoreAllMocks();
  });

  function setup(defaultSegment?: keyof typeof SEGMENTS) {
    TestBed.configureTestingModule({
      providers: [provideArgila({ segments: SEGMENTS, defaultSegment })],
    });
    TestBed.inject(ApplicationRef);
    return TestBed.inject(ArgTheme);
  }

  it('provideArgila aplica o segmento padrão ao iniciar', () => {
    const theme = setup('premium');

    expect(theme.segment()).toBe('premium');
    expect(root.getAttribute('data-arg-segment')).toBe('premium');
    expect(theme.style()).toBe('argila');
    expect(theme.palette()).toBe('terrosa');
    expect(theme.colorScheme()).toBe('dark');
    expect(theme.colors()).toEqual({ accent: 'caramelo' });
  });

  it('setSegment troca tudo de uma vez, inclusive a transparência', () => {
    const theme = setup('premium');

    theme.setSegment('vidro');

    expect(theme.style()).toBe('transparente');
    expect(theme.palette()).toBe('oceano');
    expect(theme.colors()).toEqual({});
    expect(theme.surfaceOpacity()).toBe(0.6);

    theme.setSegment('essencial');
    expect(theme.style()).toBe('argila');
    expect(theme.palette()).toBe('nativa');
    expect(theme.surfaceOpacity()).toBeUndefined();
  });

  it('trocar de segmento não avisa sobre a paleta e as cores do anterior', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const theme = setup('premium');

    theme.setSegment('vidro');

    expect(warn).not.toHaveBeenCalled();
  });

  it('ignora, com aviso, um segmento que não foi declarado', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const theme = setup('essencial');

    theme.setSegment('desconhecido');

    expect(theme.segment()).toBe('essencial');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"desconhecido" não foi declarado'));
  });

  it('sem provideArgila, não há segmentos', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const theme = TestBed.inject(ArgTheme);

    theme.setSegment('premium');

    expect(theme.segment()).toBeUndefined();
    expect(warn).toHaveBeenCalled();
  });

  it('argSegmentAttributes dá os atributos do <html> de um segmento', () => {
    expect(argSegmentAttributes(SEGMENTS.premium)).toEqual({
      'data-arg-style': 'argila',
      'data-arg-palette': 'terrosa',
      'data-arg-theme': 'dark',
      'data-arg-accent': 'caramelo',
    });
    expect(argSegmentAttributes(SEGMENTS.essencial)).toEqual({ 'data-arg-style': 'argila' });
    expect(INVALID.style).toBe('windows-xp');
  });
});
