import { Component } from '@angular/core';
import { ArgSkeleton } from '../skeleton';

@Component({
  selector: 'doc-skeleton-card-example',
  imports: [ArgSkeleton],
  template: `
    <div
      role="group"
      aria-busy="true"
      aria-label="Carregando produto"
      style="width: 16rem; padding: var(--arg-space-4); display: grid; gap: var(--arg-space-3);
      background: var(--arg-color-surface); border: 1px solid var(--arg-color-border);
      border-radius: var(--arg-radius-container)"
    >
      <arg-skeleton shape="rect" height="10rem" />
      <div>
        <arg-skeleton width="80%" />
        <arg-skeleton width="40%" />
      </div>
      <arg-skeleton
        shape="rect"
        height="2.5rem"
        style="--arg-skeleton-radius: var(--arg-radius-control)"
      />
    </div>
  `,
})
export class SkeletonCardExample {}
