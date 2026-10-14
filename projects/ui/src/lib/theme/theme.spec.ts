import { TestBed } from '@angular/core/testing';
import { ArgTheme } from './theme';

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
});
