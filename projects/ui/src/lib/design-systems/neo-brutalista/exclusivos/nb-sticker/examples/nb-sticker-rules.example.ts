import { Component } from '@angular/core';
import { ArgNbSticker } from '../nb-sticker';

/** Selos com as regras do Neo-brutalista, nos três tons e inclinações. */
@Component({
  selector: 'doc-nb-sticker-rules-example',
  imports: [ArgNbSticker],
  template: `
    <div class="stickers">
      <span arg-nb-sticker>Uma ação primária</span>
      <span arg-nb-sticker tone="accent" tilt="right">Foco sempre visível</span>
      <span arg-nb-sticker tone="neutral" tilt="none">Alvo de 44px</span>
    </div>
  `,
  styles: `
    .stickers {
      display: flex;
      flex-wrap: wrap;
      gap: var(--arg-space-6);
      align-items: center;
      padding: var(--arg-space-4);
    }
  `,
})
export class NbStickerRulesExample {}
