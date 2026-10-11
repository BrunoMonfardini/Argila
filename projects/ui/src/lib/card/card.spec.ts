import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_CARD, ArgCardVariant } from './card';

@Component({
  imports: [ARG_CARD],
  template: `
    <article arg-card id="clicavel" [variant]="variant()">
      <h3 arg-card-title>
        @if (clickable()) {
          <button arg-card-link type="button" (click)="opened = opened + 1">Thor</button>
        } @else {
          Thor
        }
      </h3>
      <p arg-card-description>Golden retriever, 4 anos</p>
      <footer arg-card-actions>
        <button type="button" (click)="scheduled = scheduled + 1">Agendar</button>
      </footer>
    </article>
    <section arg-card id="simples"><p arg-card-content>Sem link</p></section>
  `,
})
class Host {
  readonly variant = signal<ArgCardVariant>('outlined');
  readonly clickable = signal(true);
  opened = 0;
  scheduled = 0;
}

describe('ArgCard', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const card = root.querySelector<HTMLElement>('#clicavel')!;
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      card,
      simple: root.querySelector<HTMLElement>('#simples')!,
      link: () => card.querySelector<HTMLButtonElement>('[arg-card-link]'),
      action: card.querySelector<HTMLButtonElement>('footer button')!,
    };
  }

  it('aplica a classe de card e a variante', async () => {
    const { fixture, host, card, simple } = await setup();
    expect(card.classList).toContain('arg-card');
    expect(simple.classList).toContain('arg-card');
    expect(card.classList).not.toContain('arg-card--elevated');

    host.variant.set('elevated');
    await fixture.whenStable();
    expect(card.classList).toContain('arg-card--elevated');
  });

  it('fica interativo quando tem um arg-card-link, em qualquer nível', async () => {
    const { fixture, host, card, simple } = await setup();
    expect(card.classList).toContain('arg-card--interactive');
    expect(simple.classList).not.toContain('arg-card--interactive');

    host.clickable.set(false);
    await fixture.whenStable();
    expect(card.classList).not.toContain('arg-card--interactive');
  });

  it('o link se chama só pelo título, não pelo card inteiro', async () => {
    const { link } = await setup();
    expect(link()!.classList).toContain('arg-card__link');
    expect(accessibleName(link()!)).toBe('Thor');
  });

  it('os botões internos ficam fora do link e não o acionam', async () => {
    const { host, link, action } = await setup();
    expect(link()!.contains(action)).toBe(false);

    action.click();
    expect(host.scheduled).toBe(1);
    expect(host.opened).toBe(0);

    link()!.click();
    expect(host.opened).toBe(1);
    expect(host.scheduled).toBe(1);
  });

  it('link e botões internos continuam no Tab, nessa ordem', async () => {
    const { card } = await setup();
    const focusable = Array.from(card.querySelectorAll<HTMLElement>('a[href], button')).filter(
      (el) => el.tabIndex >= 0,
    );
    expect(focusable.map((el) => el.textContent?.trim())).toEqual(['Thor', 'Agendar']);
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
