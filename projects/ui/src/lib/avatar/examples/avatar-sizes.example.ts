import { Component } from '@angular/core';
import { ArgAvatar } from '../avatar';

/** Sem foto, aparecem as iniciais do primeiro e do último nome. */
@Component({
  selector: 'doc-avatar-sizes-example',
  imports: [ArgAvatar],
  template: `
    <arg-avatar name="Maria da Silva Souza" size="sm" />
    <arg-avatar name="João Pereira" />
    <arg-avatar name="Ana" size="lg" />
  `,
})
export class AvatarSizesExample {}
