import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../../../../testing/a11y';
import { ArgXpBalloon, ArgXpBalloonTail } from './xp-balloon';

@Component({
  imports: [ArgXpBalloon],
  template: `<div arg-xp-balloon [tail]="tail()">Atualização concluída</div>`,
})
class Host {
  readonly tail = signal<ArgXpBalloonTail>('start');
}

describe('ArgXpBalloon', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, balloon: root.querySelector('div')! };
  }

  it('é um status: o leitor de tela anuncia o texto', async () => {
    const { balloon } = await setup();

    expect(balloon.getAttribute('role')).toBe('status');
    expect(balloon.textContent).toBe('Atualização concluída');
  });

  it('o lado da ponta vira classe', async () => {
    const { fixture, balloon } = await setup();
    expect(balloon.classList).toContain('arg-xp-balloon--tail-start');

    fixture.componentInstance.tail.set('end');
    await fixture.whenStable();

    expect(balloon.classList).toContain('arg-xp-balloon--tail-end');
    expect(balloon.classList).toContain('arg-xp-balloon');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
