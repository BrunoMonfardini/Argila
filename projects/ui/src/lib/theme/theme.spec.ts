import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { ARG_DESIGN_SYSTEMS, ARG_PALETTES, ARG_STYLES, ArgTheme } from './theme';

describe('ArgTheme', () => {
  let theme: ArgTheme;
  const root = document.documentElement;

  beforeEach(() => {
    theme = TestBed.inject(ArgTheme);
  });

  afterEach(() => {
    theme.clearBrand();
    theme.clearSurfaceOpacity();
    root.removeAttribute('data-arg-theme');
    root.removeAttribute('data-arg-style');
    root.removeAttribute('data-arg-palette');
  });

  it('define o modo de cor no <html>', () => {
    theme.setColorScheme('dark');
    expect(root.getAttribute('data-arg-theme')).toBe('dark');
    expect(theme.colorScheme()).toBe('dark');
  });

  it('aplica a marca como tokens semânticos', () => {
    theme.setBrand({ primary: '#1d4f91', radiusControl: '9999px' });
    expect(root.style.getPropertyValue('--arg-color-primary')).toBe('#1d4f91');
    expect(root.style.getPropertyValue('--arg-radius-control')).toBe('9999px');
  });

  it('aplica secundária e destaque', () => {
    theme.setBrand({ secondary: '#5f6b3a', accent: '#b0205f', onAccent: '#ffffff' });
    expect(root.style.getPropertyValue('--arg-color-secondary')).toBe('#5f6b3a');
    expect(root.style.getPropertyValue('--arg-color-accent')).toBe('#b0205f');
    expect(root.style.getPropertyValue('--arg-color-on-accent')).toBe('#ffffff');
  });

  it('remove tokens omitidos ao trocar de marca', () => {
    theme.setBrand({ primary: '#1d4f91', radiusControl: '9999px' });
    theme.setBrand({ primary: '#2e8b57' });
    expect(root.style.getPropertyValue('--arg-color-primary')).toBe('#2e8b57');
    expect(root.style.getPropertyValue('--arg-radius-control')).toBe('');
  });

  it('aplica a opacidade das superfícies dentro da faixa permitida', () => {
    theme.setSurfaceOpacity(0.6);
    expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('0.6');
    expect(theme.surfaceOpacity()).toBe(0.6);

    theme.setSurfaceOpacity(0.1);
    expect(theme.surfaceOpacity()).toBe(0.4);
    theme.setSurfaceOpacity(3);
    expect(theme.surfaceOpacity()).toBe(1);
  });

  it('volta à opacidade do estilo', () => {
    theme.setSurfaceOpacity(0.6);
    theme.clearSurfaceOpacity();
    expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('');
    expect(theme.surfaceOpacity()).toBeUndefined();
  });

  it('começa no estilo Argila com a paleta nativa', () => {
    expect(theme.style()).toBe('argila');
    expect(theme.palette()).toBe('nativa');
  });

  it('lê estilo e paleta já presentes no <html>, ignorando valores desconhecidos', () => {
    root.setAttribute('data-arg-style', 'coda');
    root.setAttribute('data-arg-palette', 'nao-existe');
    TestBed.resetTestingModule();

    const fresh = TestBed.inject(ArgTheme);

    expect(fresh.style()).toBe('coda');
    expect(fresh.palette()).toBe('nativa');
  });

  it('aplica estilo e paleta como atributos no <html>', () => {
    theme.setStyle('windows-xp');
    theme.setPalette('terrosa');

    expect(root.getAttribute('data-arg-style')).toBe('windows-xp');
    expect(root.getAttribute('data-arg-palette')).toBe('terrosa');
    expect(theme.style()).toBe('windows-xp');
    expect(theme.palette()).toBe('terrosa');
  });

  it('ARG_STYLES e ARG_PALETTES vêm dos manifestos', () => {
    expect(Object.keys(ARG_STYLES)).toEqual(Object.keys(ARG_DESIGN_SYSTEMS));
    expect(ARG_STYLES['windows-xp'].schemes).toEqual(ARG_DESIGN_SYSTEMS['windows-xp'].modos);
    expect(ARG_PALETTES).toEqual(['nativa', 'terrosa']);
  });

  describe('o que o design system não aceita', () => {
    let warn: jest.SpiedFunction<typeof console.warn>;

    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    it('troca para a paleta padrão do design system novo e avisa', () => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        paletas: ['nativa'],
      } as never);
      theme.setPalette('terrosa');

      theme.setStyle('coda');

      expect(theme.palette()).toBe('nativa');
      expect(root.getAttribute('data-arg-palette')).toBe('nativa');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('não aceita a paleta "terrosa"'));
    });

    it('recusa uma paleta que o design system atual não aceita', () => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        paletas: ['nativa'],
      } as never);
      theme.setStyle('coda');

      theme.setPalette('terrosa');

      expect(theme.palette()).toBe('nativa');
      expect(theme.palettes()).toEqual(['nativa']);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('usando "nativa"'));
    });

    it('ao ler o <html>, troca uma paleta não aceita pela padrão', () => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        paletas: ['nativa'],
      } as never);
      root.setAttribute('data-arg-style', 'coda');
      root.setAttribute('data-arg-palette', 'terrosa');
      TestBed.resetTestingModule();

      expect(TestBed.inject(ArgTheme).palette()).toBe('nativa');
    });

    it('sem transparência no design system, ignora a opacidade e avisa', () => {
      theme.setStyle('windows-xp');

      theme.setSurfaceOpacity(0.6);

      expect(theme.acceptsTransparency()).toBe(false);
      expect(theme.surfaceOpacity()).toBeUndefined();
      expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('não aceita transparência'));
    });

    it('ao trocar para um design system sem transparência, volta as superfícies a opacas', () => {
      theme.setStyle('transparente');
      theme.setSurfaceOpacity(0.6);

      theme.setStyle('coda');

      expect(theme.surfaceOpacity()).toBeUndefined();
      expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('');
    });
  });

  describe('estilo com um modo só', () => {
    beforeEach(() => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        modos: ['dark'],
      } as never);
    });

    afterEach(() => jest.restoreAllMocks());

    it('troca o modo para o do estilo e recusa os outros', () => {
      theme.setColorScheme('light');
      theme.setStyle('coda');

      expect(theme.schemes()).toEqual(['dark']);
      expect(theme.colorScheme()).toBe('dark');

      theme.setColorScheme('light');
      expect(root.getAttribute('data-arg-theme')).toBe('dark');
      theme.setColorScheme('auto');
      expect(theme.colorScheme()).toBe('dark');
    });
  });
});
