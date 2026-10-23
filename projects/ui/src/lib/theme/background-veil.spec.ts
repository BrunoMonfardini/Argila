import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import {
  ARG_VEIL_MEASURER,
  ARG_VEIL_SAMPLE_SIZE,
  type ArgVeilColors,
  argImageExtremes,
  argMinimumVeil,
} from './background-veil';

const DARK: ArgVeilColors = {
  background: [17, 17, 17],
  texts: [[238, 238, 238]],
  spots: [],
};

describe('véu mínimo de uma imagem', () => {
  it('uma imagem toda escura no modo escuro não precisa de véu', () => {
    expect(argMinimumVeil([[0, 0, 0]], DARK)).toBe(0);
  });

  it('um pixel branco no modo escuro pede véu, e o véu achado é o menor que passa', () => {
    const veil = argMinimumVeil([[255, 255, 255]], DARK);
    const thinner = { ...DARK, background: DARK.background };

    expect(veil).toBeGreaterThan(0.5);
    expect(veil).toBeLessThan(1);
    // Com a mesma imagem e um texto mais claro, o véu necessário só pode cair
    expect(
      argMinimumVeil([[255, 255, 255]], { ...thinner, texts: [[255, 255, 255]] }),
    ).toBeLessThan(veil);
  });

  it('as manchas por cima da imagem também entram na conta', () => {
    expect(argMinimumVeil([[0, 0, 0]], { ...DARK, spots: [[255, 255, 255]] })).toBeGreaterThan(0);
  });

  it('quando nem o véu opaco basta, devolve 1', () => {
    expect(argMinimumVeil([[0, 0, 0]], { ...DARK, texts: [[30, 30, 30]] })).toBe(1);
  });
});

describe('extremos de uma imagem', () => {
  it('acha o pixel mais escuro e o mais claro, ignorando os transparentes', () => {
    const data = new Uint8ClampedArray([
      ...[40, 40, 40, 255],
      ...[0, 0, 0, 0],
      ...[200, 210, 220, 255],
      ...[255, 255, 255, 10],
      ...[90, 30, 30, 255],
    ]);

    expect(argImageExtremes(data)).toEqual([
      [40, 40, 40],
      [200, 210, 220],
    ]);
  });

  it('imagem toda transparente não tem extremos', () => {
    expect(argImageExtremes(new Uint8ClampedArray([1, 2, 3, 0]))).toEqual([]);
  });
});

/**
 * O jsdom não tem canvas nem carrega imagens: o teste simula os dois e confere
 * o que a medição do navegador faz com eles.
 */
describe('medição do navegador', () => {
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

  beforeEach(() => {
    context = fakeContext();
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => context as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => jest.restoreAllMocks());

  /** Faz a próxima `<img>` criada carregar (ou falhar) assim que recebe o `src`. */
  function nextImage(outcome: 'load' | 'error') {
    const create = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const element = create(tag);
      if (tag === 'img') {
        Object.defineProperty(element, 'src', {
          set: () =>
            queueMicrotask(() =>
              (element as HTMLImageElement)[`on${outcome}`]?.(new Event(outcome)),
            ),
        });
      }
      return element;
    });
  }

  it('desenha a imagem numa cópia de 64×64, pedindo CORS', async () => {
    nextImage('load');
    const measurer = TestBed.inject(ARG_VEIL_MEASURER);

    const pixels = await measurer.imagePixels('assets/fundo.jpg');

    expect(context.drawImage).toHaveBeenCalledWith(
      expect.objectContaining({ crossOrigin: 'anonymous' }),
      0,
      0,
      ARG_VEIL_SAMPLE_SIZE,
      ARG_VEIL_SAMPLE_SIZE,
    );
    expect(pixels).toHaveLength(ARG_VEIL_SAMPLE_SIZE * ARG_VEIL_SAMPLE_SIZE * 4);
  });

  it('recusa a imagem que não abre', async () => {
    nextImage('error');
    const measurer = TestBed.inject(ARG_VEIL_MEASURER);

    await expect(measurer.imagePixels('assets/nao-existe.jpg')).rejects.toThrow('não abriu');
  });

  it('recusa quando o canvas não deixa ler a imagem (outra origem sem CORS)', async () => {
    nextImage('load');
    context.getImageData.mockImplementation(() => {
      throw new Error('tainted canvas');
    });
    const measurer = TestBed.inject(ARG_VEIL_MEASURER);

    await expect(measurer.imagePixels('https://outro.site/fundo.jpg')).rejects.toThrow('tainted');
  });

  it('resolve as cores do tema pintando cada uma num pixel, sem deixar rastro na página', () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => ({ color: '#123456' }) as CSSStyleDeclaration);
    const measurer = TestBed.inject(ARG_VEIL_MEASURER);
    const before = document.body.children.length;

    const colors = measurer.themeColors();

    expect(colors.background).toEqual([0x12, 0x34, 0x56]);
    expect(colors.texts).toHaveLength(3);
    expect(colors.spots).toHaveLength(3);
    expect(document.body.children.length).toBe(before);
  });
});
