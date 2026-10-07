import { Component } from '@angular/core';
import { ArgSkeleton } from '../skeleton';

@Component({
  selector: 'doc-skeleton-shapes-example',
  imports: [ArgSkeleton],
  template: `
    <arg-skeleton shape="circle" width="3rem" />
    <arg-skeleton shape="rect" width="10rem" height="6rem" />
    <arg-skeleton width="10rem" />
  `,
})
export class SkeletonShapesExample {}
