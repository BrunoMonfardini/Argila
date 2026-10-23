import { DOCUMENT, InjectionToken, inject } from '@angular/core';
import { ARG_VEIL_SAMPLE_SIZE } from '@brunomonfardini/ui';

/** O que o Montar tema precisa do navegador para ler uma imagem enviada. */
export interface DocImageReader {
  /** Pixels RGBA de uma cópia de 64×64 da imagem. */
  pixels(file: File): Promise<Uint8ClampedArray>;
  /** Uma URL local (`blob:`) para usar a imagem como fundo, sem enviá-la a lugar nenhum. */
  url(file: File): string;
  /** Libera uma URL de `url` que não vai mais ser usada. */
  release(url: string): void;
}

/** A leitura de verdade: `createImageBitmap` e canvas. O véu é com o `ArgTheme`. */
function browserReader(document: Document): DocImageReader {
  return {
    async pixels(file) {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = ARG_VEIL_SAMPLE_SIZE;
      const context = canvas.getContext('2d', { willReadFrequently: true })!;
      context.drawImage(bitmap, 0, 0, ARG_VEIL_SAMPLE_SIZE, ARG_VEIL_SAMPLE_SIZE);
      bitmap.close();
      return context.getImageData(0, 0, ARG_VEIL_SAMPLE_SIZE, ARG_VEIL_SAMPLE_SIZE).data;
    },
    url: (file) => URL.createObjectURL(file),
    release: (url) => URL.revokeObjectURL(url),
  };
}

export const DOC_IMAGE_READER = new InjectionToken<DocImageReader>('DOC_IMAGE_READER', {
  factory: () => browserReader(inject(DOCUMENT)),
});
