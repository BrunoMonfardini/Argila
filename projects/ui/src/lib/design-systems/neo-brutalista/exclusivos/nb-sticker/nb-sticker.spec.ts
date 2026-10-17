import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../../../../testing/a11y';
import { ArgNbSticker, ArgNbStickerTilt, ArgNbStickerTone } from './nb-sticker';

@Component({
  imports: [ArgNbSticker],
  template: `<p>
    Regra: <span arg-nb-sticker [tone]="tone()" [tilt]="tilt()">Uma ação primária</span>
  </p>`,
})
class Host {
  readonly tone = signal<ArgNbStickerTone>('primary');
  readonly tilt = signal<ArgNbStickerTilt>('left');
}

describe('ArgNbSticker', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, sticker: root.querySelector('span')! };
  }

  it('é texto comum, lido com o conteúdo ao redor', async () => {
    const { root, sticker } = await setup();

    expect(sticker.textContent).toBe('Uma ação primária');
    expect(sticker.getAttribute('role')).toBeNull();
    expect(root.textContent).toContain('Regra: Uma ação primária');
  });

  it('tom e inclinação viram classes', async () => {
    const { fixture, sticker } = await setup();
    expect(sticker.className).toBe(
      'arg-nb-sticker arg-nb-sticker--primary arg-nb-sticker--tilt-left',
    );

    fixture.componentInstance.tone.set('accent');
    fixture.componentInstance.tilt.set('none');
    await fixture.whenStable();

    expect(sticker.classList).toContain('arg-nb-sticker--accent');
    expect(sticker.classList).toContain('arg-nb-sticker--tilt-none');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
