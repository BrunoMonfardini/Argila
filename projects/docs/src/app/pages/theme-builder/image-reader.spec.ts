import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { ARG_VEIL_SAMPLE_SIZE } from '@brunomonfardini/ui';
import { DOC_IMAGE_READER } from './image-reader';

/**
 * O jsdom não tem canvas, `createImageBitmap` nem URLs `blob:`: este teste os
 * simula e confere o que o leitor do navegador faz com eles.
 */
describe('leitor de imagem do navegador', () => {
  const size = ARG_VEIL_SAMPLE_SIZE;
  const close = jest.fn();
  const context = {
    drawImage: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(size * size * 4) })),
  };

  beforeEach(() => {
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => context as unknown as CanvasRenderingContext2D);
    Object.assign(globalThis, { createImageBitmap: jest.fn(async () => ({ close })) });
    Object.assign(URL, {
      createObjectURL: jest.fn(() => 'blob:http://localhost/imagem'),
      revokeObjectURL: jest.fn(),
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('desenha a imagem numa cópia de 64×64 e devolve os pixels', async () => {
    const reader = TestBed.inject(DOC_IMAGE_READER);

    const pixels = await reader.pixels(new File(['x'], 'fundo.png', { type: 'image/png' }));

    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, size, size);
    expect(close).toHaveBeenCalled();
    expect(pixels).toHaveLength(size * size * 4);
  });

  it('cria e libera a URL local da imagem', () => {
    const reader = TestBed.inject(DOC_IMAGE_READER);

    expect(reader.url(new File(['x'], 'fundo.png'))).toBe('blob:http://localhost/imagem');
    reader.release('blob:http://localhost/imagem');

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/imagem');
  });
});
