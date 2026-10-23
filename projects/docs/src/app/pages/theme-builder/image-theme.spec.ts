import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArgTheme, provideArgila } from '@brunomonfardini/ui';
import { DOC_IMAGE_READER, type DocImageReader } from './image-reader';
import { DocImageTheme } from './image-theme';

/** Pixels de uma imagem escura com azul: 70% marinho, 30% azul vivo. */
function blueImage(): Uint8ClampedArray {
  const band = (rgb: number[], count: number) => Array.from({ length: count }, () => [...rgb, 255]);
  return new Uint8ClampedArray([...band([11, 26, 51], 700), ...band([31, 111, 224], 300)].flat());
}

describe('Montar tema a partir de uma imagem', () => {
  const root = document.documentElement;
  let reader: jest.Mocked<DocImageReader>;

  beforeEach(() => {
    reader = {
      pixels: jest.fn(async () => blueImage()),
      url: jest.fn(() => 'blob:http://localhost/imagem'),
      release: jest.fn(),
      themeColors: jest.fn(() => ({
        background: [17, 17, 17] as const,
        texts: [[238, 238, 238] as const],
        spots: [],
      })),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideArgila({}),
        { provide: DOC_IMAGE_READER, useValue: reader },
      ],
    });
    root.setAttribute('data-arg-style', 'transparente');
  });

  afterEach(() => {
    const theme = TestBed.inject(ArgTheme);
    theme.setBackgroundImage(undefined);
    theme.clearBackgroundVeil();
    theme.clearColors();
    for (const name of ['data-arg-style', 'data-arg-background', 'data-arg-theme']) {
      root.removeAttribute(name);
    }
    localStorage.clear();
  });

  async function setup() {
    const fixture = TestBed.createComponent(DocImageTheme);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const send = async (files: File[]) => {
      await fixture.componentInstance.analyze(files);
      await fixture.whenStable();
    };
    return { fixture, element, send, theme: TestBed.inject(ArgTheme) };
  }

  const file = new File(['x'], 'fundo.png', { type: 'image/png' });

  it('mostra o modo sugerido e as cores escolhidas, com a cor da imagem ao lado', async () => {
    const { element, send } = await setup();

    await send([file]);

    expect(element.textContent).toContain('Modo sugerido: escuro');
    const items = Array.from(element.querySelectorAll('li'), (li) => li.textContent ?? '');
    expect(items).toHaveLength(3);
    expect(items[0]).toContain('Primária: Anil');
    expect(items[0]).toContain('cor da imagem #1f6fe0');
  });

  it('aplicar usa a imagem como fundo, com o modo, as cores e o véu calculado', async () => {
    const { element, fixture, send, theme } = await setup();
    await send([file]);

    element.querySelector<HTMLButtonElement>('button[variant="primary"], button')!.click();
    await fixture.whenStable();

    expect(theme.colorScheme()).toBe('dark');
    expect(theme.colors().primary).toBe('anil');
    expect(theme.background()).toBe('imagem');
    expect(theme.backgroundImage()).toBe('blob:http://localhost/imagem');
    // Imagem escura no modo escuro: o véu sai bem mais fino que o padrão
    expect(theme.backgroundVeil()).toBeLessThan(0.95);
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Véu de');
    expect(element.textContent).toContain('A imagem fica só nesta aba');
  });

  it('num design system sem o fundo de imagem, aplica só o modo e as cores', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    root.setAttribute('data-arg-style', 'punk');
    const { element, fixture, send, theme } = await setup();
    await send([file]);

    expect(element.textContent).toContain('não aceita o fundo de imagem');
    element.querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();

    expect(theme.background()).not.toBe('imagem');
    expect(theme.backgroundVeil()).toBeUndefined();
  });

  it('uma imagem que não abre avisa, e tirar o arquivo limpa a análise', async () => {
    const { element, send } = await setup();
    reader.pixels.mockRejectedValueOnce(new Error('formato'));

    await send([file]);
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Não deu para ler');

    await send([file]);
    expect(element.querySelector('[role="alert"]')).toBeNull();
    await send([]);
    expect(element.textContent).not.toContain('Modo sugerido');
  });

  it('trocar de imagem libera a URL da anterior', async () => {
    const { send } = await setup();

    await send([file]);
    await send([file]);

    expect(reader.release).toHaveBeenCalledWith('blob:http://localhost/imagem');
  });
});
