import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArgSpinner, ArgSpinnerSize } from './spinner';

@Component({
  imports: [ArgSpinner],
  template: `<arg-spinner [size]="size()" [label]="label()" [decorative]="decorative()" />`,
})
class Host {
  readonly size = signal<ArgSpinnerSize>('md');
  readonly label = signal('Carregando pedidos');
  readonly decorative = signal(false);
}

describe('ArgSpinner', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const spinner: HTMLElement = fixture.nativeElement.querySelector('arg-spinner');
    return { fixture, host: fixture.componentInstance, spinner };
  }

  it('é um progressbar indeterminado com nome acessível', async () => {
    const { spinner } = await setup();
    expect(spinner.getAttribute('role')).toBe('progressbar');
    expect(spinner.getAttribute('aria-label')).toBe('Carregando pedidos');
    expect(spinner.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('aplica a classe de tamanho', async () => {
    const { fixture, host, spinner } = await setup();
    expect(spinner.classList).toContain('arg-spinner--md');
    host.size.set('lg');
    await fixture.whenStable();
    expect(spinner.classList).toContain('arg-spinner--lg');
    expect(spinner.classList).toContain('arg-spinner');
  });

  it('some da árvore de acessibilidade quando decorativo', async () => {
    const { fixture, host, spinner } = await setup();
    host.decorative.set(true);
    await fixture.whenStable();
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    expect(spinner.hasAttribute('role')).toBe(false);
    expect(spinner.hasAttribute('aria-label')).toBe(false);
  });
});
