import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ManifestComponent } from '../../manifest';
import { DocText } from '../../shared/text';

/** Propriedades e tokens do componente, lidos do manifesto. */
@Component({
  selector: 'doc-props-table',
  imports: [DocText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './props-table.html',
  styleUrl: './props-table.css',
})
export class DocPropsTable {
  readonly component = input.required<ManifestComponent>();
}
