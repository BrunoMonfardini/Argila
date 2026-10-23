import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { DOC_IMAGE_READER, SAMPLE_SIZE } from './image-reader';

/**
 * O jsdom não tem canvas, `createImageBitmap` nem URLs `blob:`: este teste os
 * simula e confere o que o leitor do navegador faz com eles.
 */
describe('leitor de imagem do navegador', () => {
  /** Um canvas que guarda o último preenchimento e devolve a cor dele em cada pixel. */
  function fakeContext() {
    let fill = '#000000';
    return {
      drawImage: jest.fn(),
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      set fillStyle(value: string) {
        fill = value;
      },
      get fillStyle() {
        return fill;
      },
      getImageData: jest.fn((_x: number, _y: number, width: number, height: number) => {
        const n = Number.parseInt(fill.slice(1), 16);
        const pixel = [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
        return {
          data: new Uint8ClampedArray(Array.from({ length: width * height }, () => pixel).flat()),
        };
      }),
    };
  }

  let context: ReturnType<typeof fakeContext>;
  const close = jest.fn();

  beforeEach(() => {
    context = fakeContext();
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => context as unknown as CanvasRenderingContext2D);
    Object.assign(globalThis, {
      createImageBitmap: jest.fn(async () => ({ close })),
    });
    Object.assign(URL, {
      createObjectURL: jest.fn(() => 'blob:http://localhost/imagem'),
      revokeObjectURL: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.documentElement.style.removeProperty('--arg-color-background');
  });

  it('desenha a imagem numa cópia de 64×64 e devolve os pixels', async () => {
    const reader = TestBed.inject(DOC_IMAGE_READER);

    const pixels = await reader.pixels(new File(['x'], 'fundo.png', { type: 'image/png' }));

    expect(context.drawImage).toHaveBeenCalledWith(
      expect.anything(),
      0,
      0,
      SAMPLE_SIZE,
      SAMPLE_SIZE,
    );
    expect(close).toHaveBeenCalled();
    expect(pixels).toHaveLength(SAMPLE_SIZE * SAMPLE_SIZE * 4);
  });

  it('cria e libera a URL local da imagem', () => {
    const reader = TestBed.inject(DOC_IMAGE_READER);

    expect(reader.url(new File(['x'], 'fundo.png'))).toBe('blob:http://localhost/imagem');
    reader.release('blob:http://localhost/imagem');

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/imagem');
  });

  it('resolve as cores do tema pintando cada uma num pixel, sem deixar rastro na página', () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => ({ color: '#123456' }) as CSSStyleDeclaration);
    const reader = TestBed.inject(DOC_IMAGE_READER);
    const before = document.body.children.length;

    const colors = reader.themeColors();

    expect(colors.background).toEqual([0x12, 0x34, 0x56]);
    expect(colors.texts).toHaveLength(3);
    expect(colors.spots).toHaveLength(3);
    expect(context.fillRect).toHaveBeenCalledTimes(7);
    expect(document.body.children.length).toBe(before);
  });
});
