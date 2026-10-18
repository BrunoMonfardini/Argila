import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ArgTheme, argSegmentAttributes, provideArgila } from '@brunomonfardini/ui';
import { provideDocRouter } from '../../app.routes';
import { ThemeChoice, htmlCode, segmentCode, segmentOf } from './theme-code';

const PUNK: ThemeChoice = {
  style: 'punk',
  palette: 'viva',
  defaultPalette: 'nativa',
  scheme: 'dark',
  colors: { accent: 'mostarda' },
  surfaceOpacity: undefined,
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
