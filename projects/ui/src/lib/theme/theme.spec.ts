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

  it('remove tokens omitidos ao trocar de marca', () => {
    theme.setBrand({ primary: '#1d4f91', radiusControl: '9999px' });
    theme.setBrand({ primary: '#2e8b57' });
    expect(root.style.getPropertyValue('--arg-color-primary')).toBe('#2e8b57');
    expect(root.style.getPropertyValue('--arg-radius-control')).toBe('');
  });
});
