import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../../../../testing/a11y';
import { ArgPunkStatCard, ArgPunkStatTone } from './punk-stat-card';

@Component({
  imports: [ArgPunkStatCard],
  template: `
    <article arg-punk-stat-card [tone]="tone()" label="Leads na semana" value="128">
      12 a mais que a semana passada
    </article>
  `,
})
class Host {
  readonly tone = signal<ArgPunkStatTone>('pink');
}

describe('ArgPunkStatCard', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, card: root.querySelector('article')! };
  }

  it('mostra o rótulo, o número e o detalhe, nessa ordem de leitura', async () => {
    const { card } = await setup();

    const parts = Array.from(card.querySelectorAll('p, div'), (el) => el.textContent!.trim());

    expect(parts).toEqual(['Leads na semana', '128', '12 a mais que a semana passada']);
  });

  it('o tom vira classe', async () => {
    const { fixture, card } = await setup();
    expect(card.classList).toContain('arg-punk-stat-card--pink');

    fixture.componentInstance.tone.set('blue');
    await fixture.whenStable();

    expect(card.classList).toContain('arg-punk-stat-card--blue');
    expect(card.classList).toContain('arg-punk-stat-card');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
