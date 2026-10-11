import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../testing/a11y';
import { ArgTooltip } from './tooltip';

@Component({
  imports: [ArgTooltip],
  template: `
    @if (shown()) {
      <button type="button" id="salvar" aria-describedby="ajuda" [argTooltip]="text()">
        Salvar
      </button>
    }
    <p id="ajuda">Salva como rascunho.</p>
    <button type="button" id="fechar" aria-label="Fechar" argTooltip="Fechar">x</button>
  `,
})
class Host {
  readonly shown = signal(true);
  readonly text = signal('Atalho: Ctrl + S');
}

describe('ArgTooltip', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const trigger = root.querySelector<HTMLButtonElement>('#salvar')!;
    const panels = () =>
      Array.from(document.body.querySelectorAll<HTMLElement>('arg-tooltip-panel'));
    const panelOf = (el: HTMLElement) =>
      panels().find((panel) => el.getAttribute('aria-describedby')?.includes(panel.id));
    const isOpen = (panel: HTMLElement) => panel.classList.contains('arg-tooltip--open');
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return { fixture, root, trigger, panel: panelOf(trigger)!, panels, isOpen, set };
  }

  it('cria o balão no body, com role tooltip e o texto', async () => {
    const { panel } = await setup();
    expect(panel.parentElement).toBe(document.body);
    expect(panel.getAttribute('role')).toBe('tooltip');
    expect(panel.getAttribute('popover')).toBe('manual');
    expect(panel.textContent).toBe('Atalho: Ctrl + S');
  });

  it('vira descrição do gatilho, sem apagar a descrição que já existia', async () => {
    const { trigger, panel } = await setup();
    expect(trigger.getAttribute('aria-describedby')).toBe(`ajuda ${panel.id}`);
  });

  it('não liga a descrição quando o texto repete o nome do gatilho', async () => {
    const { root } = await setup();
    expect(root.querySelector('#fechar')!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('abre no foco na hora e fecha no blur', async () => {
    const { trigger, panel, isOpen } = await setup();

    trigger.dispatchEvent(new FocusEvent('focusin'));
    expect(isOpen(panel)).toBe(true);

    trigger.dispatchEvent(new FocusEvent('focusout'));
    expect(isOpen(panel)).toBe(false);
  });

  it('abre no hover depois da espera, e o mouse pode ir até o balão', async () => {
    const { trigger, panel, isOpen } = await setup();
    vi.useFakeTimers();

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(299);
    expect(isOpen(panel)).toBe(false);
    vi.advanceTimersByTime(1);
    expect(isOpen(panel)).toBe(true);

    // Sai do gatilho e entra no balão antes de fechar: continua aberto
    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    panel.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(500);
    expect(isOpen(panel)).toBe(true);

    panel.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(100);
    expect(isOpen(panel)).toBe(false);
  });

  it('passar o mouse rápido não abre', async () => {
    const { trigger, panel, isOpen } = await setup();
    vi.useFakeTimers();

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(150);
    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(500);

    expect(isOpen(panel)).toBe(false);
  });

  it('Esc fecha sem tirar o foco e não chega a quem está por baixo', async () => {
    const { trigger, panel, isOpen } = await setup();
    const below = vi.fn();
    document.addEventListener('keydown', below);
    trigger.focus();
    trigger.dispatchEvent(new FocusEvent('focusin'));

    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    trigger.dispatchEvent(esc);

    expect(isOpen(panel)).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(esc.defaultPrevented).toBe(true);
    expect(below).not.toHaveBeenCalled();
    document.removeEventListener('keydown', below);
  });

  it('com o tooltip fechado, Esc segue para os outros', async () => {
    await setup();
    const below = vi.fn();
    document.addEventListener('keydown', below);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(below).toHaveBeenCalledTimes(1);
    document.removeEventListener('keydown', below);
  });

  it('acompanha o texto', async () => {
    const { panel, set } = await setup();
    await set((host) => host.text.set('Atalho: Cmd + S'));
    expect(panel.textContent).toBe('Atalho: Cmd + S');
  });

  it('remove o balão quando o gatilho sai da tela', async () => {
    const { panel, panels, set } = await setup();
    const before = panels().length;

    await set((host) => host.shown.set(false));

    expect(panel.isConnected).toBe(false);
    expect(panels().length).toBe(before - 1);
  });

  it('não tem violações de acessibilidade', async () => {
    const { root } = await setup();
    expect(a11yViolations(root)).toEqual([]);
  });
});
