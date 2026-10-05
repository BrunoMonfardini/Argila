import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArgIcon, ArgIconSize } from './icon';
import { ArgIconRegistry, provideArgIcons } from './icon-registry';
import { ArgIconName, argIconCheck, argIconPlus } from './icons.generated';

@Component({
  imports: [ArgIcon],
  template: `<arg-icon [name]="name()" [size]="size()" [label]="label()" />`,
})
class Host {
  readonly name = signal<ArgIconName>('plus');
  readonly size = signal<ArgIconSize | undefined>(undefined);
  readonly label = signal<string | undefined>(undefined);
}

describe('ArgIcon', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideArgIcons([argIconPlus, argIconCheck])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('arg-icon');
    return { fixture, host: fixture.componentInstance, icon, svg: icon.querySelector('svg')! };
  }

  it('desenha o ícone registrado num svg de traço com currentColor', async () => {
    const { svg } = await setup();

    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.innerHTML).toBe(argIconPlus.svg.replace('/>', '></path>'));
  });

  it('troca o desenho quando o nome muda', async () => {
    const { fixture, host, svg } = await setup();

    host.name.set('check');
    await fixture.whenStable();

    expect(svg.querySelector('path')?.getAttribute('d')).toBe('M5 12.5l4.5 4.5L19 7');
  });

  it('é decorativo sem label', async () => {
    const { icon } = await setup();

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(icon.hasAttribute('aria-label')).toBe(false);
  });

  it('vira imagem com nome acessível quando recebe label', async () => {
    const { fixture, host, icon } = await setup();

    host.label.set('Atenção');
    await fixture.whenStable();

    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Atenção');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
  });

  it('aplica o tamanho por token só quando informado', async () => {
    const { fixture, host, icon } = await setup();
    expect(icon.className).toBe('arg-icon');

    host.size.set('lg');
    await fixture.whenStable();

    expect(icon.classList).toContain('arg-icon');
    expect(icon.classList).toContain('arg-icon--lg');
  });

  it('avisa no console e não desenha nada quando o ícone não foi registrado', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { fixture, host, svg } = await setup();

    host.name.set('x');
    await fixture.whenStable();

    expect(svg.innerHTML).toBe('');
    expect(error).toHaveBeenCalledWith(expect.stringContaining('"x" não foi registrado'));
    error.mockRestore();
  });

  it('não aceita nome fora da lista de ícones (erro de compilação)', () => {
    // @ts-expect-error: 'plsu' não é um ArgIconName; no template, o mesmo erro quebra o build.
    const invalid: ArgIconName = 'plsu';

    expect(invalid).toBe('plsu');
  });
});

describe('provideArgIcons', () => {
  it('soma os ícones de vários registros na mesma aplicação', () => {
    TestBed.configureTestingModule({
      providers: [provideArgIcons([argIconPlus]), provideArgIcons([argIconCheck])],
    });

    const registry = TestBed.inject(ArgIconRegistry);

    expect(registry.get('plus')).toBe(argIconPlus.svg);
    expect(registry.get('check')).toBe(argIconCheck.svg);
    expect(registry.get('x')).toBeUndefined();
  });
});
