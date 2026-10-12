import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgStepper, ArgStepperOrientation } from './stepper';

@Component({
  imports: [ArgStepper],
  template: `
    <arg-stepper
      label="Etapas do agendamento"
      [steps]="steps"
      [current]="current()"
      [navigable]="navigable()"
      [orientation]="orientation()"
      (stepSelect)="selected = $event"
    />
  `,
})
class Host {
  readonly steps = ['Serviço', 'Pet', 'Horário', 'Confirmação'];
  readonly current = signal(2);
  readonly navigable = signal(false);
  readonly orientation = signal<ArgStepperOrientation>('horizontal');
  selected: number | null = null;
}

describe('ArgStepper', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    const steps = () => Array.from(root.querySelectorAll<HTMLLIElement>('li'));
    const text = (el: Element) => el.textContent?.replace(/\s+/g, ' ').trim();
    return { host: fixture.componentInstance, root, set, steps, text };
  }

  it('é uma lista ordenada com nome', async () => {
    const { root, steps } = await setup();
    const list = root.querySelector('ol')!;
    expect(accessibleName(list)).toBe('Etapas do agendamento');
    expect(steps()).toHaveLength(4);
  });

  it('antes da atual ficam feitas; depois, pendentes', async () => {
    const { steps } = await setup();
    expect(steps().map((li) => li.className.match(/arg-stepper__step--(\w+)/)?.[1])).toEqual([
      'done',
      'done',
      'current',
      'pending',
    ]);
  });

  it('só a atual tem aria-current="step"', async () => {
    const { steps } = await setup();
    expect(steps().map((li) => li.getAttribute('aria-current'))).toEqual([
      null,
      null,
      'step',
      null,
    ]);
  });

  it('o estado é lido em texto, não só pela cor', async () => {
    const { steps, text } = await setup();
    expect(steps().map((li) => text(li))).toEqual([
      'Serviço, concluída',
      'Pet, concluída',
      '3 Horário, atual',
      '4 Confirmação, pendente',
    ]);
  });

  it('o marcador muda de forma: ✓ nas feitas, número nas outras, e fica oculto do leitor', async () => {
    const { steps } = await setup();
    const markers = steps().map((li) => li.querySelector('.arg-stepper__marker')!);
    expect(markers.every((m) => m.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(markers[0].querySelector('arg-icon')).not.toBeNull();
    expect(markers[2].querySelector('arg-icon')).toBeNull();
    expect(markers[2].textContent?.trim()).toBe('3');
  });

  it('navigable: só as feitas viram botões, que avisam a etapa escolhida', async () => {
    const { host, root, set, text } = await setup();
    expect(root.querySelectorAll('button')).toHaveLength(0);

    await set((h) => h.navigable.set(true));
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
    // O texto do botão é o nome dele (o helper accessibleName junta nós com espaço)
    expect(buttons.map((b) => text(b))).toEqual(['Serviço, concluída', 'Pet, concluída']);

    buttons[0].click();
    expect(host.selected).toBe(0);
  });

  it('acompanha a etapa atual e a orientação', async () => {
    const { root, set, steps } = await setup();
    await set((h) => {
      h.current.set(0);
      h.orientation.set('vertical');
    });
    expect(steps()[0].getAttribute('aria-current')).toBe('step');
    expect(root.querySelector('arg-stepper')!.classList).toContain('arg-stepper--vertical');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root, set } = await setup();
    expect(a11yViolations(root)).toEqual([]);
    await set((h) => h.navigable.set(true));
    expect(a11yViolations(root)).toEqual([]);
  });
});
