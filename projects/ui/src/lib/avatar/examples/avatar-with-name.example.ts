import { Component } from '@angular/core';
import { ARG_LIST } from '../../list/list';
import { ArgAvatar } from '../avatar';

/** Com o nome escrito ao lado, o avatar é decorativo: o leitor não repete o nome. */
@Component({
  selector: 'doc-avatar-with-name-example',
  imports: [ARG_LIST, ArgAvatar],
  template: `
    <ul arg-list divided bordered>
      <li arg-list-item>
        <span arg-list-leading><arg-avatar name="Maria Souza" decorative /></span>
        <span arg-list-title>Maria Souza</span>
        <span arg-list-description>Tutora de Thor</span>
      </li>
      <li arg-list-item>
        <span arg-list-leading><arg-avatar name="João Pereira" decorative /></span>
        <span arg-list-title>João Pereira</span>
        <span arg-list-description>Tutor de Mel</span>
      </li>
    </ul>
  `,
  styles: `
    ul {
      flex: 1 1 100%;
      max-width: 28rem;
    }
  `,
})
export class AvatarWithNameExample {}
