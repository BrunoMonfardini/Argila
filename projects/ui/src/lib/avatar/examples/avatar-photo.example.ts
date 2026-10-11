import { Component } from '@angular/core';
import { ArgAvatar } from '../avatar';

/** A foto que não carrega vira as iniciais, sem ícone de imagem quebrada. */
@Component({
  selector: 'doc-avatar-photo-example',
  imports: [ArgAvatar],
  template: `
    <arg-avatar name="Thor" [src]="photo" />
    <arg-avatar name="Mel" src="/foto-que-nao-existe.jpg" />
  `,
})
export class AvatarPhotoExample {
  // Imagem gerada aqui mesmo, para o exemplo não depender de site externo
  protected readonly photo =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#d27a4c"/><circle cx="20" cy="16" r="7" fill="#fbf3ee"/><rect x="9" y="25" width="22" height="12" rx="6" fill="#fbf3ee"/></svg>',
    );
}
