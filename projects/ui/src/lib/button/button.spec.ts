import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArgButton, ArgButtonVariant } from './button';

@Component({
  imports: [ArgButton],
  template: `
    <button
      arg-button
      [variant]="variant()"
      [disabled]="disabled()"
      [loading]="loading()"
      (click)="clicks = clicks + 1"
    >
      Salvar
    </button>
    <a arg-button href="#ajuda" [disabled]="disabled()">Ajuda</a>
  `,
})
class Host {
  readonly variant = signal<ArgButtonVariant>('primary');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  clicks = 0;
}

describe('ArgButton', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      button: root.querySelector('button')!,
      link: root.querySelector('a')!,
    };
  }

  it('aplica classes de variante e tamanho padrão', async () => {
    const { button } = await setup();
    expect(button.classList).toContain('arg-button');
    expect(button.classList).toContain('arg-button--primary');
    expect(button.classList).toContain('arg-button--md');
  });

  it('troca a classe quando a variante muda', async () => {
    const { fixture, host, button } = await setup();
    host.variant.set('danger');
    await fixture.whenStable();
    expect(button.classList).toContain('arg-button--danger');
    expect(button.classList).not.toContain('arg-button--primary');
  });

  it('usa o disabled nativo em <button>', async () => {
    const { fixture, host, button } = await setup();
    host.disabled.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
  });

  it('bloqueia o botão e marca aria-busy enquanto carrega', async () => {
    const { fixture, host, button } = await setup();
    host.loading.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.arg-button__spinner')).not.toBeNull();
  });

  it('desabilita <a> com aria-disabled e impede o clique', async () => {
    const { fixture, host, link } = await setup();
    host.disabled.set(true);
    await fixture.whenStable();
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
