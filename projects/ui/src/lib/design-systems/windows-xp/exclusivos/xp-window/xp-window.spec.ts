import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../../../../testing/a11y';
import { ArgXpWindow, ArgXpWindowControl } from './xp-window';

@Component({
  imports: [ArgXpWindow],
  template: `
    <section
      arg-xp-window
      title="Confirmação"
      [controls]="controls()"
      (minimized)="events.push('min')"
      (maximized)="events.push('max')"
      (closed)="events.push('close')"
    >
      <p>Deseja continuar?</p>
    </section>
  `,
})
class Host {
  readonly controls = signal<readonly ArgXpWindowControl[]>(['minimize', 'maximize', 'close']);
  readonly events: string[] = [];
}

describe('ArgXpWindow', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const buttons = () => Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
    return { fixture, root, window: root.querySelector('section')!, buttons };
  }

  it('a janela tem o nome do título e mostra o conteúdo', async () => {
    const { window } = await setup();

    expect(accessibleName(window)).toBe('Confirmação');
    expect(window.querySelector('.arg-xp-window__body')!.textContent).toContain(
      'Deseja continuar?',
    );
  });

  it('cada botão tem nome com o título e dispara o seu evento', async () => {
    const { fixture, buttons } = await setup();

    expect(buttons().map((b) => accessibleName(b))).toEqual([
      'Minimizar Confirmação',
      'Maximizar Confirmação',
      'Fechar Confirmação',
    ]);
    buttons().forEach((b) => b.click());

    expect(fixture.componentInstance.events).toEqual(['min', 'max', 'close']);
  });

  it('mostra só os botões pedidos, ou nenhum', async () => {
    const { fixture, buttons, root } = await setup();

    fixture.componentInstance.controls.set(['close']);
    await fixture.whenStable();
    expect(buttons().map((b) => accessibleName(b))).toEqual(['Fechar Confirmação']);

    fixture.componentInstance.controls.set([]);
    await fixture.whenStable();
    expect(root.querySelector('.arg-xp-window__controls')).toBeNull();
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
