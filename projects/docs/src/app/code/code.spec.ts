import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DocCode } from './code';

@Component({
  imports: [DocCode],
  template: `<doc-code [code]="code" label="Código do botão" />`,
})
class Host {
  code = "const a = '<b>negrito</b>';\n\n";
}

describe('DocCode', () => {
  afterEach(() => vi.restoreAllMocks());

  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, pre: root.querySelector('pre')!, copy: root.querySelector('button')! };
  }

  it('mostra o código como texto, colorido por trecho, sem espaços extras no fim', async () => {
    const { pre } = await setup();

    expect(pre.textContent).toBe("const a = '<b>negrito</b>';");
    expect(pre.querySelector('b')).toBeNull();
    expect(pre.querySelector('.doc-code--keyword')?.textContent).toBe('const');
  });

  it('pode receber foco para rolar pelo teclado e tem nome acessível', async () => {
    const { pre } = await setup();

    expect(pre.getAttribute('tabindex')).toBe('0');
    expect(pre.getAttribute('aria-label')).toBe('Código do botão');
  });

  it('copia o código e avisa por alguns segundos', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const timeout = vi.spyOn(globalThis, 'setTimeout');
    const { fixture, root, copy } = await setup();

    copy.click();
    await writeText.mock.results[0].value;
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith("const a = '<b>negrito</b>';");
    expect(copy.textContent?.trim()).toBe('Copiado');
    expect(root.querySelector('[role="status"]')?.textContent).toBe('Código copiado');

    const [reset] = timeout.mock.calls.find(([, delay]) => delay === 2000)!;
    (reset as () => void)();
    await fixture.whenStable();
    expect(copy.textContent?.trim()).toBe('Copiar');
  });
});
