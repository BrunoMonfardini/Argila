import { jest } from '@jest/globals';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArgToast } from '../lib/toast/toast';
import { a11yViolations } from '../testing/a11y';
import { COLOR_USAGE_PATTERN_DOCS } from './color-usage.docs';
import { DATA_ENTRY_PATTERN_DOCS } from './data-entry.docs';
import { DISCLOSURE_PATTERN_DOCS } from './disclosure.docs';
import { DisclosureMoreExample } from './examples/disclosure.example';
import { FeedbackFormExample } from './examples/feedback.example';
import { LoadingSaveExample } from './examples/loading.example';
import { FEEDBACK_PATTERN_DOCS } from './feedback.docs';
import { LAYOUT_PATTERN_DOCS } from './layout.docs';
import { LOADING_PATTERN_DOCS } from './loading.docs';
import { NAVIGATION_PATTERN_DOCS } from './navigation.docs';

const PATTERNS = [
  LOADING_PATTERN_DOCS,
  FEEDBACK_PATTERN_DOCS,
  DATA_ENTRY_PATTERN_DOCS,
  DISCLOSURE_PATTERN_DOCS,
  NAVIGATION_PATTERN_DOCS,
  LAYOUT_PATTERN_DOCS,
  COLOR_USAGE_PATTERN_DOCS,
];

const EXAMPLES = PATTERNS.flatMap((page) =>
  page.examples.map((example) => [`${page.title} › ${example.name}`, example.component] as const),
);

async function render<T>(component: Type<T>) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  return { fixture, root: fixture.nativeElement as HTMLElement };
}

const button = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.trim() === text)!;

describe('padrões', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it.each(PATTERNS.map((page) => [page.title, page] as const))(
    '%s segue o formato: problema, solução, exemplo, regras e componentes usados',
    (_title, page) => {
      expect(page.pattern?.problem).toBeTruthy();
      expect(page.pattern?.solution).toBeTruthy();
      expect(page.examples.length).toBeGreaterThan(0);
      expect(page.guidelines?.do.length).toBeGreaterThan(0);
      expect(page.guidelines?.dont.length).toBeGreaterThan(0);
      expect(page.related?.length).toBeGreaterThan(0);
    },
  );

  it.each(EXAMPLES)('%s não tem violações de acessibilidade', async (_name, component) => {
    const { root } = await render(component);

    expect(a11yViolations(root)).toEqual([]);
  });

  it('carregamento: o botão carrega e depois confirma', () => {
    jest.useFakeTimers();
    const fixture = TestBed.createComponent(LoadingSaveExample);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    button(root, 'Salvar alterações').click();
    fixture.detectChanges();
    expect(button(root, 'Salvar alterações').getAttribute('aria-busy')).toBe('true');

    jest.advanceTimersByTime(800);
    fixture.detectChanges();
    expect(root.querySelector('[role="status"]')?.textContent).toBe('Alterações salvas.');
  });

  it('feedback: erro no campo; corrigido, toast de sucesso', async () => {
    const show = jest.spyOn(TestBed.inject(ArgToast), 'show').mockReturnValue(undefined as never);
    const { fixture, root } = await render(FeedbackFormExample);

    button(root, 'Salvar').click();
    await fixture.whenStable();
    expect(root.querySelector('[arg-alert]')).not.toBeNull();
    expect(root.textContent).toContain('Use 10 ou 11 dígitos');

    const input = root.querySelector('input')!;
    input.value = '(11) 98765-4321';
    input.dispatchEvent(new Event('input'));
    button(root, 'Salvar').click();
    await fixture.whenStable();

    expect(root.querySelector('[arg-alert]')).toBeNull();
    expect(show).toHaveBeenCalledWith('Telefone salvo', { tone: 'success' });
  });

  it('mostrar mais: o botão diz o estado e mostra o detalhe', async () => {
    const { fixture, root } = await render(DisclosureMoreExample);
    const toggle = button(root, 'Mostrar mais');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector<HTMLElement>('#mais-detalhes')!.hidden).toBe(true);

    toggle.click();
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.textContent?.trim()).toBe('Mostrar menos');
    expect(root.querySelector<HTMLElement>('#mais-detalhes')!.hidden).toBe(false);
  });
});
