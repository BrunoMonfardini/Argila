import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocShell } from './shell/shell';

@Component({
  selector: 'doc-root',
  imports: [DocShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<doc-shell />',
})
export class App {}
