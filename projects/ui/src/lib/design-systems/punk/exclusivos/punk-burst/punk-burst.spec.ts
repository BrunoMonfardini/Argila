import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../../../../testing/a11y';
import { ArgPunkBurst } from './punk-burst';

@Component({
  imports: [ArgPunkBurst],
  template: `<h1>Gerencie seus leads <arg-punk-burst tone="ink" /></h1>`,
})
class Host {}

describe('ArgPunkBurst', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { root, burst: root.querySelector('arg-punk-burst')! };
  }

  it('é só decoração: fica fora do leitor de tela e do foco', async () => {
    const { burst } = await setup();

    expect(burst.getAttribute('aria-hidden')).toBe('true');
    expect(burst.querySelector('svg')!.getAttribute('focusable')).toBe('false');
  });

  it('o tom vira classe e o título continua lido sem a estrela', async () => {
    const { root, burst } = await setup();

    expect(burst.classList).toContain('arg-punk-burst--ink');
    expect(root.querySelector('h1')!.textContent!.trim()).toBe('Gerencie seus leads');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
