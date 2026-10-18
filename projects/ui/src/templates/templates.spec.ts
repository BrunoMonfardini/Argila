import { jest } from '@jest/globals';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11yViolations } from '../testing/a11y';
import { ArgToast } from '../lib/toast/toast';
import { EmptySearchTemplate } from './examples/empty-state-template.example';
import { ErrorLoadingTemplate } from './examples/error-message-template.example';
import { LoaderActionTemplate } from './examples/loaders-template.example';
import { ReceiptTemplate } from './examples/receipt-template.example';
import { EMPTY_STATE_TEMPLATE_DOCS } from './empty-state.docs';
import { ENDING_SCREEN_TEMPLATE_DOCS } from './ending-screen.docs';
import { ERROR_MESSAGE_TEMPLATE_DOCS } from './error-message.docs';
import { LOADERS_TEMPLATE_DOCS } from './loaders.docs';
import { RECEIPT_TEMPLATE_DOCS } from './receipt.docs';

const ALL = [
  EMPTY_STATE_TEMPLATE_DOCS,
  ENDING_SCREEN_TEMPLATE_DOCS,
  ERROR_MESSAGE_TEMPLATE_DOCS,
  LOADERS_TEMPLATE_DOCS,
  RECEIPT_TEMPLATE_DOCS,
].flatMap((page) =>
  page.examples.map((example) => [`${page.title} › ${example.name}`, example.component] as const),
);

async function render<T>(component: Type<T>) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  return { fixture, root: fixture.nativeElement as HTMLElement };
}

const button = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.trim() === text)!;

describe('templates', () => {
  afterEach(() => jest.useRealTimers());

  it.each(ALL)('%s não tem violações de acessibilidade', async (_name, component) => {
    const { root } = await render(component);

    expect(a11yViolations(root)).toEqual([]);
  });

  it('busca sem resultado repete o termo e "Limpar busca" volta à lista', async () => {
    const { fixture, root } = await render(EmptySearchTemplate);
    expect(root.textContent).toContain('Nada encontrado para “Mariana”');

    button(root, 'Limpar busca').click();
    await fixture.whenStable();

    expect(Array.from(root.querySelectorAll('li'), (li) => li.textContent)).toEqual([
      'Maria Souza',
      'João Pereira',
      'Ana Lima',
    ]);
  });

  it('erro de carregamento: tentar de novo carrega no botão e some o alerta', () => {
    jest.useFakeTimers();
    const fixture = TestBed.createComponent(ErrorLoadingTemplate);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Tentar de novo').click();
    fixture.detectChanges();
    expect(button(root, 'Tentar de novo').getAttribute('aria-busy')).toBe('true');

    jest.advanceTimersByTime(600);
    fixture.detectChanges();
    expect(root.querySelector('[arg-alert]')).toBeNull();
    expect(root.querySelector('[role="status"]')?.textContent).toBe('Pedidos carregados.');
  });

  it('ação com duração: a barra avança até o fim e o botão volta', () => {
    jest.useFakeTimers();
    const fixture = TestBed.createComponent(LoaderActionTemplate);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Enviar fotos').click();
    fixture.detectChanges();
    expect(root.querySelector('progress')?.getAttribute('value')).toBe('0');

    jest.advanceTimersByTime(1200);
    fixture.detectChanges();
    expect(root.querySelector('progress')?.getAttribute('value')).toBe('100');
    expect(button(root, 'Enviar fotos').getAttribute('aria-busy')).toBeNull();
  });

  it('comprovante: compartilhar e baixar confirmam com toast', async () => {
    const show = jest.spyOn(TestBed.inject(ArgToast), 'show').mockReturnValue(undefined as never);
    const { root } = await render(ReceiptTemplate);

    button(root, 'Compartilhar').click();
    button(root, 'Baixar PDF').click();

    expect(show.mock.calls.map((call) => call[0])).toEqual([
      'Link do comprovante copiado',
      'Comprovante baixado',
    ]);
  });
});
