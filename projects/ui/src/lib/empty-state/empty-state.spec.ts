import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { provideArgIcons } from '../icon/icon-registry';
import { argIconCheckCircle, type ArgIconName } from '../icon/icons.generated';
import { ArgEmptyState, ArgEmptyStateLevel } from './empty-state';

@Component({
  imports: [ArgEmptyState],
  template: `
    <section
      arg-empty-state
      heading="Nenhum pedido ainda"
      [level]="level()"
      [icon]="icon()"
      [bordered]="bordered()"
    >
      Os pedidos aparecem aqui.
      <button arg-empty-state-action type="button">Novo pedido</button>
    </section>
    <div arg-empty-state heading="Sem resultados"></div>
  `,
})
class Host {
  readonly level = signal<ArgEmptyStateLevel>(2);
  readonly icon = signal<ArgIconName | undefined>(undefined);
  readonly bordered = signal(false);
}

describe('ArgEmptyState', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideArgIcons([argIconCheckCircle])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return {
      root,
      set,
      section: root.querySelector<HTMLElement>('section')!,
      div: root.querySelector<HTMLElement>('div[arg-empty-state]')!,
    };
  }

  it('o título é um h2 por padrão, e o nível muda com level', async () => {
    const { section, set } = await setup();
    expect(section.querySelector('h2')?.textContent?.trim()).toBe('Nenhum pedido ainda');

    await set((host) => host.level.set(4));
    expect(section.querySelector('h2')).toBeNull();
    expect(section.querySelector('h4')?.textContent?.trim()).toBe('Nenhum pedido ainda');
  });

  it('a section leva o título como nome; o div fica sem nome', async () => {
    const { section, div } = await setup();
    expect(accessibleName(section)).toBe('Nenhum pedido ainda');
    expect(div.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('projeta o texto e as ações em áreas próprias', async () => {
    const { section } = await setup();
    expect(section.querySelector('.arg-empty-state__text')?.textContent?.trim()).toBe(
      'Os pedidos aparecem aqui.',
    );
    expect(section.querySelector('.arg-empty-state__actions button')?.textContent).toBe(
      'Novo pedido',
    );
  });

  it('mostra o ícone decorativo só quando pedido', async () => {
    const { section, set } = await setup();
    expect(section.querySelector('arg-icon')).toBeNull();

    await set((host) => host.icon.set('check-circle'));
    expect(section.querySelector('arg-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('bordered liga a borda por classe', async () => {
    const { section, set } = await setup();
    expect(section.classList).toContain('arg-empty-state');
    expect(section.classList).not.toContain('arg-empty-state--bordered');

    await set((host) => host.bordered.set(true));
    expect(section.classList).toContain('arg-empty-state--bordered');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root, set } = await setup();
    await set((host) => host.icon.set('check-circle'));
    expect(a11yViolations(root)).toEqual([]);
  });
});
