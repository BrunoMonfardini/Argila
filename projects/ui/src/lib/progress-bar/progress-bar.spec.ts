import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgProgressBar, ArgProgressBarSize } from './progress-bar';

@Component({
  imports: [ArgProgressBar],
  template: `
    <progress
      arg-progress
      label="Enviando fotos"
      [value]="value()"
      [max]="max()"
      [valueText]="valueText()"
      [size]="size()"
    ></progress>
  `,
})
class Host {
  readonly value = signal<number | null | undefined>(2);
  readonly max = signal(5);
  readonly valueText = signal<string | undefined>(undefined);
  readonly size = signal<ArgProgressBarSize>('md');
}

describe('ArgProgressBar', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return { root, set, bar: root.querySelector('progress')! };
  }

  it('é um <progress> nativo com o label como nome', async () => {
    const { bar } = await setup();
    expect(bar.tagName).toBe('PROGRESS');
    expect(accessibleName(bar)).toBe('Enviando fotos');
  });

  it('determinada: passa value e max ao elemento nativo', async () => {
    const { bar } = await setup();
    expect(bar.getAttribute('value')).toBe('2');
    expect(bar.getAttribute('max')).toBe('5');
    expect(bar.value).toBe(2);
    expect(bar.max).toBe(5);
  });

  it('sem value (null ou undefined), fica indeterminada', async () => {
    const { bar, set } = await setup();

    await set((host) => host.value.set(null));
    expect(bar.hasAttribute('value')).toBe(false);

    await set((host) => host.value.set(0));
    expect(bar.getAttribute('value')).toBe('0');

    await set((host) => host.value.set(undefined));
    expect(bar.hasAttribute('value')).toBe(false);
  });

  it('valueText vira aria-valuetext', async () => {
    const { bar, set } = await setup();
    expect(bar.hasAttribute('aria-valuetext')).toBe(false);

    await set((host) => host.valueText.set('2 de 5 fotos'));
    expect(bar.getAttribute('aria-valuetext')).toBe('2 de 5 fotos');
  });

  it('aplica o tamanho por classe', async () => {
    const { bar, set } = await setup();
    expect(bar.classList).toContain('arg-progress');
    expect(bar.classList).toContain('arg-progress--md');

    await set((host) => host.size.set('sm'));
    expect(bar.classList).toContain('arg-progress--sm');
    expect(bar.classList).not.toContain('arg-progress--md');
  });

  it('não tem violações de acessibilidade, determinada e indeterminada', async () => {
    const { root, set } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    await set((host) => host.value.set(null));
    expect(a11yViolations(root)).toEqual([]);
  });
});
