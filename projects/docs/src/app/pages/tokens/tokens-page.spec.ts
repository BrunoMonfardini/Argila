import { TestBed } from '@angular/core/testing';
import { DOC_MANIFEST, Manifest } from '../../manifest';
import { computedTokenValue, tokenKind } from './token-kind';
import { TokensPage } from './tokens-page';

const MANIFEST: Manifest = {
  pages: {},
  tokens: [
    { name: '--arg-color-primary', value: 'light-dark(#a24c24, #d27a4c)', group: 'Marca' },
    { name: '--arg-space-4', value: '1rem', group: 'Espaçamento' },
    { name: '--arg-z-modal', value: '1300', group: 'Camadas' },
  ],
};

describe('tokenKind', () => {
  it('escolhe a amostra pelo nome do token', () => {
    expect(tokenKind('--arg-color-text')).toBe('color');
    expect(tokenKind('--arg-loading-bg')).toBe('color');
    expect(tokenKind('--arg-shadow-color')).toBe('color');
    expect(tokenKind('--arg-space-2')).toBe('space');
    expect(tokenKind('--arg-radius-control')).toBe('radius');
    expect(tokenKind('--arg-shadow-md')).toBe('shadow');
    expect(tokenKind('--arg-font-size-body')).toBe('font-size');
    expect(tokenKind('--arg-z-modal')).toBe('other');
  });
});

describe('computedTokenValue', () => {
  const root = document.documentElement;

  afterEach(() => {
    root.style.removeProperty('--arg-z-teste');
    root.style.removeProperty('--arg-space-teste');
  });

  it('lê o valor do token direto quando não há amostra', () => {
    root.style.setProperty('--arg-z-teste', ' 42 ');

    expect(computedTokenValue('--arg-z-teste', root)).toBe('42');
  });

  it('aplica o token num elemento de prova e remove o elemento depois', () => {
    root.style.setProperty('--arg-space-teste', '12px');
    const before = document.body.childElementCount;

    computedTokenValue('--arg-space-teste', root);

    expect(document.body.childElementCount).toBe(before);
  });
});

describe('TokensPage', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [{ provide: DOC_MANIFEST, useValue: MANIFEST }] });
    const fixture = TestBed.createComponent(TokensPage);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  afterEach(() => document.documentElement.style.removeProperty('--arg-z-modal'));

  it('agrupa os tokens do manifesto pelo grupo, na ordem do arquivo', async () => {
    const { root } = await setup();

    const headings = Array.from(root.querySelectorAll('section h2'), (h) => h.textContent);

    expect(headings).toEqual(['Marca', 'Espaçamento', 'Camadas']);
    expect(root.querySelector('#grupo-espacamento')).not.toBeNull();
  });

  it('desenha a amostra com o próprio token', async () => {
    const { root } = await setup();

    const swatch = root.querySelector<HTMLElement>('.doc-tokens__swatch')!;
    const space = root.querySelector<HTMLElement>('.doc-tokens__space')!;

    expect(swatch.style.background).toBe('var(--arg-color-primary)');
    expect(space.style.width).toBe('var(--arg-space-4)');
    expect(root.textContent).toContain('light-dark(#a24c24, #d27a4c)');
  });

  it('atualiza o valor atual quando o tema do <html> muda', async () => {
    const { fixture, root } = await setup();
    const current = () =>
      Array.from(root.querySelectorAll('tr'))
        .find((row) => row.textContent?.includes('--arg-z-modal'))
        ?.querySelector('.doc-tokens__current')?.textContent;

    document.documentElement.style.setProperty('--arg-z-modal', '9');
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();

    expect(current()).toBe('9');
  });
});
