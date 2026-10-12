import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ARG_TABS, ArgTabsActivation } from './tabs';

@Component({
  imports: [ARG_TABS],
  template: `
    <arg-tabs label="Ficha do pet" [(selected)]="selected" [activation]="activation()">
      <arg-tab label="Dados" value="dados">Golden retriever</arg-tab>
      <arg-tab label="Vacinas">Antirrábica em dia</arg-tab>
      <arg-tab label="Financeiro" disabled>Sem permissão</arg-tab>
      <arg-tab label="Histórico" value="historico">Banho em 12/09</arg-tab>
    </arg-tabs>
  `,
})
class Host {
  readonly selected = signal<string | undefined>(undefined);
  readonly activation = signal<ArgTabsActivation>('automatic');
}

describe('ArgTabs', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    const press = async (target: HTMLElement, key: string) => {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      await fixture.whenStable();
    };
    const visible = () => panels.filter((panel) => !panel.hidden).map((p) => p.textContent);
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return { host: fixture.componentInstance, root, tabs, panels, press, visible, set };
  }

  it('tem a lista com nome, as abas e os painéis ligados entre si', async () => {
    const { root, tabs, panels } = await setup();
    const list = root.querySelector('[role="tablist"]')!;

    expect(accessibleName(list)).toBe('Ficha do pet');
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual([
      'Dados',
      'Vacinas',
      'Financeiro',
      'Histórico',
    ]);
    tabs.forEach((tab, i) => {
      expect(tab.getAttribute('aria-controls')).toBe(panels[i].id);
      expect(panels[i].getAttribute('aria-labelledby')).toBe(tab.id);
      expect(accessibleName(panels[i])).toBe(tab.textContent?.trim());
    });
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('sem seleção, abre a primeira aba; só ela entra no Tab', async () => {
    const { tabs, visible } = await setup();
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(visible()).toEqual(['Golden retriever']);
  });

  it('as setas trocam de aba e abrem o painel, pulando a desabilitada e dando a volta', async () => {
    const { host, tabs, press, visible } = await setup();
    tabs[0].focus();

    await press(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
    expect(host.selected()).toBe('Vacinas');
    expect(visible()).toEqual(['Antirrábica em dia']);

    await press(tabs[1], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[3]);
    expect(host.selected()).toBe('historico');
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([-1, -1, -1, 0]);

    await press(tabs[3], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[0]);

    await press(tabs[0], 'ArrowLeft');
    expect(document.activeElement).toBe(tabs[3]);
  });

  it('Home e End vão às pontas', async () => {
    const { host, tabs, press } = await setup();
    tabs[0].focus();

    await press(tabs[0], 'End');
    expect(host.selected()).toBe('historico');
    await press(tabs[3], 'Home');
    expect(host.selected()).toBe('dados');
  });

  it('clique abre a aba; na desabilitada, nada muda', async () => {
    const { host, set, tabs, visible } = await setup();

    tabs[3].click();
    expect(host.selected()).toBe('historico');

    tabs[2].click();
    await set(() => undefined);
    expect(host.selected()).toBe('historico');
    expect(visible()).toEqual(['Banho em 12/09']);
  });

  it('[(selected)]: abre a aba pelo valor vindo de fora', async () => {
    const { set, tabs, visible } = await setup();
    await set((host) => host.selected.set('Vacinas'));

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].tabIndex).toBe(0);
    expect(visible()).toEqual(['Antirrábica em dia']);
  });

  it('manual: as setas só movem o foco; clique (Enter e Espaço) abre', async () => {
    const { host, set, tabs, press, visible } = await setup();
    await set((h) => h.activation.set('manual'));
    tabs[0].focus();

    await press(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
    expect(host.selected()).toBeUndefined();
    expect(visible()).toEqual(['Golden retriever']);

    tabs[1].click();
    expect(host.selected()).toBe('Vacinas');
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
