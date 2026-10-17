import { Component } from '@angular/core';
import { ArgPunkDotTrack } from '../punk-dot-track';

/** O andamento de duas campanhas, como na referência. */
@Component({
  selector: 'doc-punk-dot-track-campaign-example',
  imports: [ArgPunkDotTrack],
  template: `
    <div class="tracks">
      <arg-punk-dot-track label="Campanha Inwood" [value]="5" [max]="8" />
      <arg-punk-dot-track label="Campanha Greenville" [value]="2" [max]="8" />
    </div>
  `,
  styles: `
    .tracks {
      display: grid;
      gap: var(--arg-space-3);
      max-width: 22rem;
    }
  `,
})
export class PunkDotTrackCampaignExample {}
