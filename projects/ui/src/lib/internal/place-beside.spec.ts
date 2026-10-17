import { jest } from '@jest/globals';
import { placeBeside, supportsAnchor } from './place-beside';

describe('placeBeside', () => {
  let trigger: HTMLElement;
  let panel: HTMLElement;

  /** Gatilho e painel com medidas fixas, numa janela de 400 × 300. */
  function measure(anchor: Partial<DOMRect>, box = { width: 100, height: 50 }) {
    jest.replaceProperty(window, 'innerWidth', 400);
    jest.replaceProperty(window, 'innerHeight', 300);
    const rect = { left: 0, top: 0, width: 40, height: 20, ...anchor };
    trigger.getBoundingClientRect = () =>
      ({ ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height }) as DOMRect;
    panel.getBoundingClientRect = () => ({ left: 0, top: 0, ...box }) as DOMRect;
  }

  beforeEach(() => {
    trigger = document.createElement('button');
    panel = document.createElement('div');
    document.body.append(trigger, panel);
  });

  afterEach(() => {
    trigger.remove();
    panel.remove();
    jest.restoreAllMocks();
  });

  it('põe embaixo, centralizado no gatilho', () => {
    measure({ left: 180, top: 100 });
    placeBeside(trigger, panel, 'bottom');
    expect(panel.style.left).toBe('150px');
    expect(panel.style.top).toBe('128px');
  });

  it('alinha pelo início ou pelo fim do gatilho', () => {
    measure({ left: 180, top: 100 });
    placeBeside(trigger, panel, 'bottom', 'start');
    expect(panel.style.left).toBe('180px');

    placeBeside(trigger, panel, 'bottom', 'end');
    expect(panel.style.left).toBe('120px');
  });

  it('vira para cima quando não cabe embaixo', () => {
    measure({ left: 180, top: 260 });
    placeBeside(trigger, panel, 'bottom');
    expect(panel.style.top).toBe('202px');
  });

  it('vira para a esquerda quando não cabe à direita', () => {
    measure({ left: 340, top: 100 });
    placeBeside(trigger, panel, 'right');
    expect(panel.style.left).toBe('232px');
  });

  it('nunca sai da tela, mesmo quando nenhum lado cabe inteiro', () => {
    measure({ left: 0, top: 100 });
    placeBeside(trigger, panel, 'top');
    expect(panel.style.left).toBe('8px');

    measure({ left: 390, top: 100 });
    placeBeside(trigger, panel, 'top', 'start');
    expect(panel.style.left).toBe('292px');
  });

  it('supportsAnchor: sem CSS.supports (jsdom), considera que há suporte e não posiciona por JS', () => {
    expect(supportsAnchor(null)).toBe(true);
    expect(supportsAnchor({ CSS: { supports: () => false } } as unknown as Window)).toBe(false);
    expect(supportsAnchor({ CSS: { supports: () => true } } as unknown as Window)).toBe(true);
  });
});
