import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgLink, ArgLinkVariant } from './link';

@Component({
  imports: [ArgLink],
  template: `
    <p>
      Leia o
      <a arg-link href="https://exemplo.com/guia" [variant]="variant()" [external]="external()"
        >guia de cuidados</a
      >.
    </p>
    <a arg-link external externalHint="(nova janela)" href="#outro">Outro</a>
  `,
})
class Host {
  readonly variant = signal<ArgLinkVariant>('default');
  readonly external = signal(false);
}

describe('ArgLink', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const [link, other] = Array.from(root.querySelectorAll<HTMLAnchorElement>('a'));
    return { fixture, host: fixture.componentInstance, root, link, other };
  }

  it('é um link nativo com a classe do Argila, na mesma aba por padrão', async () => {
    const { link } = await setup();

    expect(link.classList).toContain('arg-link');
    expect(link.getAttribute('href')).toBe('https://exemplo.com/guia');
    expect(link.hasAttribute('target')).toBe(false);
    expect(link.querySelector('arg-icon')).toBeNull();
    expect(accessibleName(link)).toBe('guia de cuidados');
  });

  it('externo abre em nova aba com segurança, mostra o ícone e avisa o leitor de tela', async () => {
    const { fixture, host, link } = await setup();

    host.external.set(true);
    await fixture.whenStable();

    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.querySelector('arg-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(accessibleName(link)).toBe('guia de cuidados (abre em nova aba)');
  });

  it('registra o próprio ícone, sem provideArgIcons no produto', async () => {
    const { other } = await setup();

    expect(other.querySelector('arg-icon path')).not.toBeNull();
  });

  it('aceita outro texto de aviso', async () => {
    const { other } = await setup();

    expect(accessibleName(other)).toBe('Outro (nova janela)');
  });

  it('aplica a variante discreta por classe', async () => {
    const { fixture, host, link } = await setup();
    expect(link.classList).not.toContain('arg-link--muted');

    host.variant.set('muted');
    await fixture.whenStable();

    expect(link.classList).toContain('arg-link--muted');
  });

  it('não tem violações de acessibilidade, comum ou externo', async () => {
    const { fixture, host, root } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    host.external.set(true);
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });
});
