import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../../testing/a11y';
import { ArgButtonSize, ArgButtonVariant } from '../button/button-base';
import { provideArgIcons } from '../icon/icon-registry';
import { argIconPlus, argIconX } from '../icon/icons.generated';
import { ArgIconButton } from './icon-button';

@Component({
  imports: [ArgIconButton],
  template: `
    <button
      arg-icon-button
      [icon]="icon()"
      [label]="label()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [loading]="loading()"
      (click)="clicks = clicks + 1"
    ></button>
    <a arg-icon-button icon="x" label="Voltar" href="#inicio" [disabled]="disabled()"></a>
  `,
})
class Host {
  readonly icon = signal<'plus' | 'x'>('plus');
  readonly label = signal('Adicionar');
  readonly variant = signal<ArgButtonVariant>('tertiary');
  readonly size = signal<ArgButtonSize>('md');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  clicks = 0;
}

describe('ArgIconButton', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideArgIcons([argIconPlus, argIconX])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      button: root.querySelector('button')!,
      link: root.querySelector('a')!,
    };
  }

  it('usa o label como nome acessível e o ícone como decoração', async () => {
    const { button } = await setup();

    expect(button.getAttribute('aria-label')).toBe('Adicionar');
    expect(button.querySelector('arg-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(button.querySelector('path')).not.toBeNull();
  });

  it('é terciário e médio por padrão, com as classes do Button', async () => {
    const { button } = await setup();

    expect(button.classList).toContain('arg-button');
    expect(button.classList).toContain('arg-button--tertiary');
    expect(button.classList).toContain('arg-button--md');
  });

  it('o ícone acompanha o tamanho e troca quando o nome muda', async () => {
    const { fixture, host, button } = await setup();

    host.size.set('lg');
    host.icon.set('x');
    host.label.set('Fechar');
    await fixture.whenStable();

    expect(button.querySelector('arg-icon')?.classList).toContain('arg-icon--lg');
    expect(button.querySelector('path')?.getAttribute('d')).toBe('M6 6l12 12M18 6L6 18');
    expect(button.getAttribute('aria-label')).toBe('Fechar');
  });

  it('carregando mostra o spinner, marca aria-busy e bloqueia o clique', async () => {
    const { fixture, host, button } = await setup();

    host.loading.set(true);
    await fixture.whenStable();
    button.click();

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(true);
    expect(button.querySelector('.arg-button__spinner')).not.toBeNull();
    expect(host.clicks).toBe(0);
  });

  it('em <a>, desabilitado vira aria-disabled e sai da ordem de tabulação', async () => {
    const { fixture, host, link } = await setup();

    host.disabled.set(true);
    await fixture.whenStable();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(event.defaultPrevented).toBe(true);
  });

  it('não tem violações de acessibilidade, em nenhum estado', async () => {
    const { fixture, host, root } = await setup();
    expect(a11yViolations(root)).toEqual([]);

    host.disabled.set(true);
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);

    host.disabled.set(false);
    host.loading.set(true);
    await fixture.whenStable();
    expect(a11yViolations(root)).toEqual([]);
  });

  it('acusa label vazio na verificação de acessibilidade', async () => {
    const { fixture, host, root } = await setup();

    host.label.set('');
    await fixture.whenStable();

    expect(a11yViolations(root).map((v) => v.rule)).toEqual(['nome-acessivel']);
  });
});
