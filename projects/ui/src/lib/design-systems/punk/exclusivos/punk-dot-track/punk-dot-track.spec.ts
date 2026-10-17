import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../../../../testing/a11y';
import { ArgPunkDotTrack } from './punk-dot-track';

@Component({
  imports: [ArgPunkDotTrack],
  template: `<arg-punk-dot-track label="Campanha Inwood" [value]="value()" [max]="4" />`,
})
class Host {
  readonly value = signal(1);
}

describe('ArgPunkDotTrack', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const track = root.querySelector('arg-punk-dot-track') as HTMLElement;
    return { fixture, root, track };
  }

  it('é uma barra de progresso com nome, valor e texto do valor', async () => {
    const { track } = await setup();

    expect(track.getAttribute('role')).toBe('progressbar');
    expect(accessibleName(track)).toBe('Campanha Inwood');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('4');
    expect(track.getAttribute('aria-valuenow')).toBe('1');
    expect(track.getAttribute('aria-valuetext')).toBe('1 de 4');
  });

  it('um ponto por etapa, com as concluídas marcadas, e a alça na posição', async () => {
    const { fixture, track } = await setup();
    fixture.componentInstance.value.set(3);
    await fixture.whenStable();

    const dots = Array.from(track.querySelectorAll('.arg-punk-dot-track__dot'));
    expect(dots).toHaveLength(4);
    expect(dots.map((dot) => dot.classList.contains('arg-punk-dot-track__dot--done'))).toEqual([
      true,
      true,
      true,
      false,
    ]);
    const knob = track.querySelector<HTMLElement>('.arg-punk-dot-track__knob')!;
    expect(knob.style.getPropertyValue('--arg-punk-dot-track-progress')).toBe('0.75');
  });

  it('prende o valor entre 0 e o máximo', async () => {
    const { fixture, track } = await setup();

    fixture.componentInstance.value.set(9);
    await fixture.whenStable();
    expect(track.getAttribute('aria-valuenow')).toBe('4');

    fixture.componentInstance.value.set(-2);
    await fixture.whenStable();
    expect(track.getAttribute('aria-valuenow')).toBe('0');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
