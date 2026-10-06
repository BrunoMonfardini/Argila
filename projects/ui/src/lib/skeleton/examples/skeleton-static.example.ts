import { Component } from '@angular/core';
import { ArgSkeleton } from '../skeleton';

@Component({
  selector: 'doc-skeleton-static-example',
  imports: [ArgSkeleton],
  template: `
    <arg-skeleton shape="circle" width="2.5rem" [animated]="false" />
    <arg-skeleton width="12rem" [animated]="false" />
  `,
})
export class SkeletonStaticExample {}
