import { TestBed } from '@angular/core/testing';
import { ARG_STYLES, ArgStyle, ArgTheme } from './theme';

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

  describe('estilo com um modo só', () => {
    const styles = ARG_STYLES as Record<ArgStyle, { schemes: readonly ('light' | 'dark')[] }>;
    let original: readonly ('light' | 'dark')[];

    beforeEach(() => {
      original = styles.coda.schemes;
      styles.coda = { schemes: ['dark'] };
    });

    afterEach(() => {
      styles.coda = { schemes: original };
    });

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
