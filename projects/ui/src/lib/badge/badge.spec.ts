import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../testing/a11y';
import { ArgBadge, ArgBadgeTone } from './badge';

@Component({
  imports: [ArgBadge],
  template: `<p>Status: <span arg-badge [tone]="tone()">Confirmado</span></p>`,
})
class Host {
  readonly tone = signal<ArgBadgeTone>('neutral');
}

describe('ArgBadge', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, host: fixture.componentInstance, root, badge: root.querySelector('span')! };
  }

  it('mostra o texto com o tom neutro por padrão', async () => {
    const { badge } = await setup();

    expect(badge.textContent).toBe('Confirmado');
    expect(badge.classList).toContain('arg-badge');
    expect(badge.classList).toContain('arg-badge--neutral');
  });

  it('troca a classe do tom', async () => {
    const { fixture, host, badge } = await setup();

    host.tone.set('success');
    await fixture.whenStable();

    expect(badge.classList).toContain('arg-badge--success');
    expect(badge.classList).not.toContain('arg-badge--neutral');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
