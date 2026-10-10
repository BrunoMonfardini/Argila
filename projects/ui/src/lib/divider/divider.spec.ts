import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../testing/a11y';
import { ArgDivider, ArgDividerOrientation, ArgDividerSpacing } from './divider';

@Component({
  imports: [ArgDivider],
  template: `<hr
    arg-divider
    [orientation]="orientation()"
    [spacing]="spacing()"
    [decorative]="decorative()"
  />`,
})
class Host {
  readonly orientation = signal<ArgDividerOrientation>('horizontal');
  readonly spacing = signal<ArgDividerSpacing>('md');
  readonly decorative = signal(false);
}

describe('ArgDivider', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, host: fixture.componentInstance, root, hr: root.querySelector('hr')! };
  }

  it('é um separador horizontal nativo, com espaço médio', async () => {
    const { hr } = await setup();

    expect(hr.classList).toContain('arg-divider');
    expect(hr.classList).toContain('arg-divider--horizontal');
    expect(hr.classList).toContain('arg-divider--spacing-md');
    expect(hr.hasAttribute('aria-orientation')).toBe(false);
    expect(hr.hasAttribute('role')).toBe(false);
  });

  it('na vertical, informa a orientação para leitores de tela', async () => {
    const { fixture, host, hr } = await setup();

    host.orientation.set('vertical');
    host.spacing.set('sm');
    await fixture.whenStable();

    expect(hr.classList).toContain('arg-divider--vertical');
    expect(hr.classList).toContain('arg-divider--spacing-sm');
    expect(hr.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('decorativo some da árvore de acessibilidade', async () => {
    const { fixture, host, hr } = await setup();

    host.decorative.set(true);
    await fixture.whenStable();

    expect(hr.getAttribute('role')).toBe('none');
  });

  it('não tem violações de acessibilidade em nenhuma combinação', async () => {
    const { fixture, host, root } = await setup();

    for (const orientation of ['horizontal', 'vertical'] as const) {
      for (const decorative of [false, true]) {
        host.orientation.set(orientation);
        host.decorative.set(decorative);
        await fixture.whenStable();
        expect(a11yViolations(root)).toEqual([]);
      }
    }
  });
});
