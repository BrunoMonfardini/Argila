import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ArgTheme, argSegmentAttributes, provideArgila } from '@brunomonfardini/ui';
import { provideDocRouter } from '../../app.routes';
import {
  PRODUCT_BACKGROUND_IMAGE,
  ThemeChoice,
  htmlCode,
  segmentCode,
  segmentOf,
} from './theme-code';

const PUNK: ThemeChoice = {
  style: 'punk',
  palette: 'viva',
  defaultPalette: 'nativa',
  scheme: 'dark',
  colors: { accent: 'mostarda' },
  surfaceOpacity: undefined,
  background: 'liso',
  defaultBackground: 'liso',
};

describe('Montar tema', () => {
  afterEach(() => localStorage.clear());

  it('o segmento leva só o que difere do padrão', () => {
    expect(segmentOf(PUNK)).toEqual({
      style: 'punk',
      palette: 'viva',
      scheme: 'dark',
      colors: { accent: 'mostarda' },
    });
    expect(
      segmentOf({ ...PUNK, style: 'argila', palette: 'nativa', colors: {}, surfaceOpacity: 0.7 }),
    ).toEqual({ style: 'argila', scheme: 'dark', surfaceOpacity: 0.7 });
    expect(segmentOf({ ...PUNK, style: 'argila', background: 'degrade' })).toMatchObject({
      background: 'degrade',
    });
  });

  it('gera o provideArgila e o HTML com os atributos', () => {
    const segment = segmentOf(PUNK);

    expect(segmentCode(segment)).toBe(`provideArgila({
  segments: {
    meuSegmento: {
      style: 'punk',
      palette: 'viva',
      scheme: 'dark',
      colors: { accent: 'mostarda' },
    },
  },
  defaultSegment: 'meuSegmento',
})`);
    expect(htmlCode(segment)).toBe(
      '<html data-arg-style="punk" data-arg-palette="viva" data-arg-theme="dark" data-arg-accent="mostarda">',
    );
    expect(htmlCode({ style: 'transparente', surfaceOpacity: 0.6 })).toContain(
      '--arg-surface-opacity: 0.6;',
    );
  });

  it('o fundo imagem leva o caminho da imagem no produto, o véu e o movimento', () => {
    const choice: ThemeChoice = {
      ...PUNK,
      style: 'transparente',
      palette: 'nativa',
      colors: {},
      background: 'imagem',
      backgroundImage: 'blob:http://localhost/123',
      backgroundVeil: 0.55,
      backgroundMotion: true,
    };
    const segment = segmentOf(choice);

    expect(segment).toEqual({
      style: 'transparente',
      scheme: 'dark',
      background: 'imagem',
      backgroundImage: PRODUCT_BACKGROUND_IMAGE,
      backgroundVeil: 0.55,
      backgroundMotion: true,
    });
    expect(segmentCode(segment)).toContain("backgroundImage: 'assets/fundo.jpg',");
    expect(htmlCode(segment)).toContain('data-arg-background-motion=""');
    expect(htmlCode(segment)).toContain('--arg-background-photo: url("assets/fundo.jpg");');
    expect(htmlCode(segment)).toContain(
      '--arg-background-veil: color-mix(in oklab, var(--arg-color-background) 55%, transparent);',
    );
    // Sem o fundo imagem, a imagem e o véu não vão para o código
    expect(segmentOf({ ...choice, background: 'degrade' })).not.toHaveProperty('backgroundImage');
  });

  it('colar o segmento num produto reproduz o que se vê', () => {
    const segment = segmentOf(PUNK);
    TestBed.configureTestingModule({
      providers: [provideArgila({ segments: { copiado: segment } })],
    });
    const theme = TestBed.inject(ArgTheme);
    const root = document.documentElement;

    theme.setSegment('copiado');

    expect(theme.style()).toBe('punk');
    expect(theme.palette()).toBe('viva');
    expect(theme.colorScheme()).toBe('dark');
    expect(theme.colors()).toEqual({ accent: 'mostarda' });
    for (const [name, value] of Object.entries(argSegmentAttributes(segment))) {
      expect(root.getAttribute(name)).toBe(value);
    }
    theme.setStyle('argila');
  });

  it('a página mostra o código do tema escolhido e acompanha as mudanças', async () => {
    TestBed.configureTestingModule({ providers: [provideDocRouter()] });
    const harness = await RouterTestingHarness.create('/ferramentas/montar-tema');
    const root = harness.routeNativeElement!;
    const code = () => Array.from(root.querySelectorAll('doc-code pre'), (pre) => pre.textContent);

    expect(root.querySelector('h1')?.textContent).toBe('Montar tema');
    expect(root.querySelector('doc-theme-bar')).not.toBeNull();
    expect(code()[0]).toContain("style: 'argila'");

    TestBed.inject(ArgTheme).setStyle('windows-xp');
    await harness.fixture.whenStable();

    expect(code()[0]).toContain("style: 'windows-xp'");
    expect(code()[1]).toContain('data-arg-style="windows-xp"');
    TestBed.inject(ArgTheme).setStyle('argila');
  });
});
