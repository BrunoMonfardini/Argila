import { ArgilaConfig } from '@brunomonfardini/ui';

/**
 * Segmentos de exemplo do catálogo, como um produto declararia com
 * `provideArgila`: escolhas de aparência com nome, aplicadas de uma vez.
 */
export const DOC_SEGMENTS = {
  essencial: { style: 'argila' },
  premium: { style: 'argila', palette: 'terrosa', scheme: 'dark', colors: { primary: 'cobre' } },
  vibrante: { style: 'punk', palette: 'viva' },
} as const satisfies ArgilaConfig['segments'];

export const DOC_SEGMENT_LABELS: Record<keyof typeof DOC_SEGMENTS, string> = {
  essencial: 'Essencial',
  premium: 'Premium',
  vibrante: 'Vibrante',
};
