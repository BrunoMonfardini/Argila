import { Component } from '@angular/core';
import { ArgSkeleton } from '../skeleton';

@Component({
  selector: 'doc-skeleton-paragraph-example',
  imports: [ArgSkeleton],
  template: `
    <div
      role="group"
      aria-busy="true"
      aria-label="Carregando descrição"
      style="width: 100%; max-width: 28rem"
    >
      <arg-skeleton />
      <arg-skeleton width="92%" />
      <arg-skeleton width="60%" />
    </div>
  `,
})
export class SkeletonParagraphExample {}
