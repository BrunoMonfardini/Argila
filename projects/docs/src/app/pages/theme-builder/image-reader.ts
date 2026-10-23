import { DOCUMENT, InjectionToken, inject } from '@angular/core';
import type { VeilColors } from './veil';

/** Lado da cópia pequena da imagem: basta para as cores e para os extremos. */
export const SAMPLE_SIZE = 64;

/** O que o Montar tema precisa do navegador para ler uma imagem. */
export interface DocImageReader {
  /** Pixels RGBA de uma cópia de 64×64 da imagem. */
  pixels(file: File): Promise<Uint8ClampedArray>;
  /** Uma URL local (`blob:`) para usar a imagem como fundo, sem enviá-la a lugar nenhum. */
  url(file: File): string;
  /** Libera uma URL de `url` que não vai mais ser usada. */
  release(url: string): void;
  /** As cores do tema aplicado agora, resolvidas, para a conta do véu. */
  themeColors(): VeilColors;
}

const TEXTS = ['--arg-color-text', '--arg-color-text-muted', '--arg-color-text-link'];
const SPOTS = ['--arg-color-primary', '--arg-color-secondary', '--arg-color-accent'];

/** A leitura de verdade: canvas, `createImageBitmap` e a cor calculada pelo CSS. */
function browserReader(document: Document): DocImageReader {
  /**
   * Resolve um token: lê a cor que o navegador calcula num elemento escondido
   * e a pinta num pixel de canvas, que devolve sRGB. A cor calculada pode vir
   * como `rgb()`, `oklab()` ou `color()`, conforme o token use `color-mix()`.
   */
  const resolve = (tokens: string[]) => {
    const probe = document.createElement('span');
    probe.hidden = true;
    document.body.append(probe);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    try {
      return tokens.map((token) => {
        probe.style.color = `var(${token})`;
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = getComputedStyle(probe).color;
        context.fillRect(0, 0, 1, 1);
        const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
        return [r, g, b] as const;
      });
    } finally {
      probe.remove();
    }
  };
  return {
    async pixels(file) {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = SAMPLE_SIZE;
      const context = canvas.getContext('2d', { willReadFrequently: true })!;
      context.drawImage(bitmap, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      bitmap.close();
      return context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
    },
    url: (file) => URL.createObjectURL(file),
    release: (url) => URL.revokeObjectURL(url),
    themeColors() {
      const [background, ...rest] = resolve(['--arg-color-background', ...TEXTS, ...SPOTS]);
      return {
        background,
        texts: rest.slice(0, TEXTS.length),
        spots: rest.slice(TEXTS.length),
      };
    },
  };
}

export const DOC_IMAGE_READER = new InjectionToken<DocImageReader>('DOC_IMAGE_READER', {
  factory: () => browserReader(inject(DOCUMENT)),
});
