import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAvatar, initialsOf } from './avatar';

@Component({
  imports: [ArgAvatar],
  template: `<arg-avatar [name]="name()" [src]="src()" [decorative]="decorative()" />`,
})
class Host {
  readonly name = signal('Maria da Silva Souza');
  readonly src = signal<string | null>(null);
  readonly decorative = signal(false);
}

describe('initialsOf', () => {
  it('usa a primeira letra do primeiro e do último nome, em maiúsculas', () => {
    expect(initialsOf('Maria da Silva Souza')).toBe('MS');
    expect(initialsOf('  ana   lima ')).toBe('AL');
    expect(initialsOf('Thor')).toBe('T');
    expect(initialsOf('élio ávila')).toBe('ÉÁ');
    expect(initialsOf('   ')).toBe('');
  });
});

describe('ArgAvatar', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      avatar: root.querySelector('arg-avatar')!,
    };
  }

  it('sem foto, mostra as iniciais e se apresenta pelo nome completo', async () => {
    const { avatar } = await setup();

    expect(avatar.textContent?.trim()).toBe('MS');
    expect(avatar.getAttribute('role')).toBe('img');
    expect(accessibleName(avatar)).toBe('Maria da Silva Souza');
    expect(avatar.querySelector('.arg-avatar__initials')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('com foto, usa a imagem com o nome no alt', async () => {
    const { fixture, host, avatar } = await setup();

    host.src.set('foto.jpg');
    await fixture.whenStable();

    const img = avatar.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('foto.jpg');
    expect(img.alt).toBe('Maria da Silva Souza');
    expect(avatar.hasAttribute('role')).toBe(false);
  });

  it('se a foto não carregar, volta às iniciais; uma foto nova tenta de novo', async () => {
    const { fixture, host, avatar } = await setup();
    host.src.set('quebrada.jpg');
    await fixture.whenStable();

    avatar.querySelector('img')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(avatar.querySelector('img')).toBeNull();
    expect(avatar.textContent?.trim()).toBe('MS');

    host.src.set('outra.jpg');
    await fixture.whenStable();
    expect(avatar.querySelector('img')?.getAttribute('src')).toBe('outra.jpg');
  });

  it('decorativo sai da árvore de acessibilidade', async () => {
    const { fixture, host, avatar } = await setup();

    host.decorative.set(true);
    await fixture.whenStable();

    expect(avatar.getAttribute('aria-hidden')).toBe('true');
    expect(avatar.hasAttribute('role')).toBe(false);
  });

  it('aplica o tamanho por classe', async () => {
    const { avatar } = await setup();

    expect(avatar.classList).toContain('arg-avatar--md');
  });

  it('não tem violações de acessibilidade, com e sem foto', async () => {
    const { fixture, host, root } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    host.src.set('foto.jpg');
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });
});
