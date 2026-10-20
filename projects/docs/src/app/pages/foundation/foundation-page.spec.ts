import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ArgTheme } from '@brunomonfardini/ui';
import { provideDocRouter } from '../../app.routes';
import { DOC_MANIFEST, Manifest } from '../../manifest';
import { FOUNDATION_TOPICS, findTopic, topicTokens } from './topics';

const MANIFEST: Manifest = {
  pages: {},
  tokens: [
    { name: '--arg-color-primary', value: '#123', group: 'Marca' },
    { name: '--arg-space-4', value: '1rem', group: 'Espaçamento' },
    { name: '--arg-space-4', value: '1rem', group: 'Espaçamento' },
    { name: '--arg-font-size-body', value: '1rem', group: 'Tipografia' },
    { name: '--arg-line-height-body', value: '1.5', group: 'Tipografia' },
    { name: '--arg-radius-control', value: '8px', group: 'Raio' },
    { name: '--arg-shadow-2', value: 'none', group: 'Elevação' },
    { name: '--arg-shadow-color', value: '#000', group: 'Elevação' },
    { name: '--arg-background-image', value: 'none', group: 'Fundo' },
    { name: '--arg-gradient-brand', value: 'linear-gradient(…)', group: 'Fundo' },
    { name: '--arg-motion-fast', value: '120ms', group: 'Movimento' },
    { name: '--arg-motion-easing', value: 'ease', group: 'Movimento' },
  ],
};

describe('Fundação', () => {
  const names = (slug: string) => topicTokens(findTopic(slug)!, MANIFEST.tokens).map((t) => t.name);

  it('cada tópico pega só os tokens dele, sem repetir', () => {
    expect(FOUNDATION_TOPICS.map((t) => t.slug)).toEqual([
      'cores',
      'tipografia',
      'espacamento',
      'raio-e-elevacao',
      'fundos',
      'movimento',
    ]);
    expect(names('fundos')).toEqual(['--arg-background-image', '--arg-gradient-brand']);
    expect(names('cores')).toEqual(['--arg-color-primary']);
    expect(names('espacamento')).toEqual(['--arg-space-4']);
    expect(names('tipografia')).toEqual(['--arg-font-size-body', '--arg-line-height-body']);
    expect(names('raio-e-elevacao')).toEqual(['--arg-radius-control', '--arg-shadow-2']);
    expect(names('movimento')).toEqual(['--arg-motion-fast', '--arg-motion-easing']);
    expect(findTopic('nao-existe')).toBeUndefined();
  });

  async function open(url: string) {
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), { provide: DOC_MANIFEST, useValue: MANIFEST }],
    });
    const harness = await RouterTestingHarness.create(url);
    return { harness, root: harness.routeNativeElement! };
  }

  it('mostra os tokens com amostra e de onde vêm os valores', async () => {
    const { root } = await open('/fundacao/cores');

    expect(root.querySelector('h1')?.textContent).toBe('Cores');
    expect(root.querySelector('.doc-foundation__context')?.textContent).toBe(
      'Valores de agora: Argila com a paleta nativa, modo claro.',
    );
    expect(root.querySelector('tbody th')?.textContent?.trim()).toBe('--arg-color-primary');
    expect(root.querySelector('.doc-foundation__swatch')).not.toBeNull();
    expect(document.title).toBe('Cores · Argila');
  });

  it('o contexto acompanha o design system e a paleta escolhidos', async () => {
    const { harness, root } = await open('/fundacao/espacamento');
    const theme = TestBed.inject(ArgTheme);

    theme.setStyle('punk');
    theme.setPalette('viva');
    await harness.fixture.whenStable();

    expect(root.querySelector('.doc-foundation__context')?.textContent).toBe(
      'Valores de agora: Punk com a paleta Viva, modo escuro.',
    );
    theme.setStyle('argila');
  });

  it('a amostra de movimento anda ao pedir', async () => {
    const { harness, root } = await open('/fundacao/movimento');
    const button = root.querySelector<HTMLButtonElement>('button')!;

    expect(button.textContent?.trim()).toBe('Ver o movimento');
    button.click();
    await harness.fixture.whenStable();

    expect(button.textContent?.trim()).toBe('Voltar');
    expect(root.querySelectorAll('.doc-foundation__dot--moved').length).toBe(2);
  });

  it('em Fundos, escolhe o fundo do catálogo; num DS só liso, explica', async () => {
    const { harness, root } = await open('/fundacao/fundos');
    const theme = TestBed.inject(ArgTheme);
    const degrade = Array.from(root.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Degradê',
    )!;

    degrade.click();
    await harness.fixture.whenStable();
    expect(theme.background()).toBe('degrade');
    expect(degrade.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelectorAll('.doc-foundation__swatch--wide').length).toBe(2);

    theme.setStyle('punk');
    await harness.fixture.whenStable();
    expect(root.textContent).toContain('O Punk tem só o fundo liso.');
    theme.setStyle('argila');
    document.documentElement.removeAttribute('data-arg-style');
  });

  it('cada tipo de amostra aparece no seu tópico', async () => {
    const { harness, root } = await open('/fundacao/tipografia');
    expect(root.querySelector('.doc-foundation__type')).not.toBeNull();

    await harness.navigateByUrl('/fundacao/raio-e-elevacao');
    expect(harness.routeNativeElement!.querySelectorAll('.doc-foundation__shape').length).toBe(2);
  });
});
