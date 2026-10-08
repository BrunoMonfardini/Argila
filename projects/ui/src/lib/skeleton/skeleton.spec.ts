import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArgSkeleton, ArgSkeletonShape } from './skeleton';
import { a11yViolations } from '../../testing/a11y';

@Component({
  imports: [ArgSkeleton],
  template: `<arg-skeleton
    [shape]="shape()"
    [width]="width()"
    [height]="height()"
    [animated]="animated()"
  />`,
})
class Host {
  readonly shape = signal<ArgSkeletonShape>('text');
  readonly width = signal<string | undefined>(undefined);
  readonly height = signal<string | undefined>(undefined);
  readonly animated = signal(true);
}

describe('ArgSkeleton', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const skeleton: HTMLElement = fixture.nativeElement.querySelector('arg-skeleton');
    return { fixture, host: fixture.componentInstance, skeleton };
  }

  it('é decorativo e começa como linha de texto', async () => {
    const { skeleton } = await setup();
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.classList).toContain('arg-skeleton');
    expect(skeleton.classList).toContain('arg-skeleton--text');
  });

  it('aplica largura e altura informadas', async () => {
    const { fixture, host, skeleton } = await setup();
    host.shape.set('rect');
    host.width.set('60%');
    host.height.set('4rem');
    await fixture.whenStable();
    expect(skeleton.classList).toContain('arg-skeleton--rect');
    expect(skeleton.style.width).toBe('60%');
    expect(skeleton.style.height).toBe('4rem');
  });

  it('círculo usa a largura como altura quando a altura é omitida', async () => {
    const { fixture, host, skeleton } = await setup();
    host.shape.set('circle');
    host.width.set('3rem');
    await fixture.whenStable();
    expect(skeleton.style.height).toBe('3rem');
  });

  it('é animado por padrão e fica estático com animated=false', async () => {
    const { fixture, host, skeleton } = await setup();
    expect(skeleton.classList).not.toContain('arg-skeleton--static');

    host.animated.set(false);
    await fixture.whenStable();

    expect(skeleton.classList).toContain('arg-skeleton--static');
    expect(skeleton.classList).toContain('arg-skeleton--text');
  });

  it('não força altura inline em texto sem altura informada', async () => {
    const { fixture, host, skeleton } = await setup();
    host.width.set('50%');
    await fixture.whenStable();
    expect(skeleton.style.height).toBe('');
  });

  it('não tem violações de acessibilidade em nenhum formato', async () => {
    const { fixture, host } = await setup();

    for (const shape of ['text', 'rect', 'circle'] as const) {
      host.shape.set(shape);
      await fixture.whenStable();
      expect(a11yViolations(fixture.nativeElement)).toEqual([]);
    }
  });
});
