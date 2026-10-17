import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../../../../testing/a11y';
import { ArgNbRules } from './nb-rules';

@Component({
  imports: [ArgNbRules],
  template: `
    <aside arg-nb-rules label="Regras de uso">
      <ul>
        <li>Contorno preto grosso</li>
        <li>Foco sempre visível</li>
      </ul>
    </aside>
  `,
})
class Host {}

describe('ArgNbRules', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { root, aside: root.querySelector('aside')! };
  }

  it('o aside tem o nome do título visível', async () => {
    const { aside } = await setup();

    expect(aside.querySelector('.arg-nb-rules__title')!.textContent).toBe('Regras de uso');
    expect(accessibleName(aside)).toBe('Regras de uso');
  });

  it('mostra as regras projetadas', async () => {
    const { aside } = await setup();

    expect(Array.from(aside.querySelectorAll('li'), (li) => li.textContent)).toEqual([
      'Contorno preto grosso',
      'Foco sempre visível',
    ]);
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();

    expect(a11yViolations(root)).toEqual([]);
  });
});
