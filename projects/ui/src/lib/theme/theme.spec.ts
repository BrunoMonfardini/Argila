import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import {
  ARG_ALLOWED_COLORS,
  ARG_BRAND_COLORS,
  ARG_DESIGN_SYSTEMS,
  ARG_PALETTES,
  ARG_STYLES,
  ArgBrandColor,
  ArgTheme,
} from './theme';
import {
  ARG_VEIL_MEASURER,
  type ArgVeilColors,
  type ArgVeilMeasurer,
  argImageExtremes,
  argMinimumVeil,
} from './background-veil';

describe('ArgTheme', () => {
  let theme: ArgTheme;
  const root = document.documentElement;

  beforeEach(() => {
    theme = TestBed.inject(ArgTheme);
  });

  afterEach(() => {
    theme.clearColors();
    theme.clearBrand();
    theme.clearSurfaceOpacity();
    root.removeAttribute('data-arg-theme');
    root.removeAttribute('data-arg-style');
    root.removeAttribute('data-arg-palette');
    root.removeAttribute('data-arg-background');
    for (const role of ['primary', 'secondary', 'accent']) root.removeAttribute(`data-arg-${role}`);
  });

  it('define o modo de cor no <html>', () => {
    theme.setColorScheme('dark');
    expect(root.getAttribute('data-arg-theme')).toBe('dark');
    expect(theme.colorScheme()).toBe('dark');
  });

  it('aplica a marca como tokens semânticos', () => {
    theme.setBrand({ primary: '#1d4f91', radiusControl: '9999px' });
    expect(root.style.getPropertyValue('--arg-color-primary')).toBe('#1d4f91');
    expect(root.style.getPropertyValue('--arg-radius-control')).toBe('9999px');
  });

  it('aplica secundária e destaque', () => {
    theme.setBrand({ secondary: '#5f6b3a', accent: '#b0205f', onAccent: '#ffffff' });
    expect(root.style.getPropertyValue('--arg-color-secondary')).toBe('#5f6b3a');
    expect(root.style.getPropertyValue('--arg-color-accent')).toBe('#b0205f');
    expect(root.style.getPropertyValue('--arg-color-on-accent')).toBe('#ffffff');
  });

  it('remove tokens omitidos ao trocar de marca', () => {
    theme.setBrand({ primary: '#1d4f91', radiusControl: '9999px' });
    theme.setBrand({ primary: '#2e8b57' });
    expect(root.style.getPropertyValue('--arg-color-primary')).toBe('#2e8b57');
    expect(root.style.getPropertyValue('--arg-radius-control')).toBe('');
  });

  it('aplica a opacidade das superfícies dentro da faixa permitida', () => {
    theme.setSurfaceOpacity(0.6);
    expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('0.6');
    expect(theme.surfaceOpacity()).toBe(0.6);

    theme.setSurfaceOpacity(0.1);
    expect(theme.surfaceOpacity()).toBe(0.4);
    theme.setSurfaceOpacity(3);
    expect(theme.surfaceOpacity()).toBe(1);
  });

  it('volta à opacidade do estilo', () => {
    theme.setSurfaceOpacity(0.6);
    theme.clearSurfaceOpacity();
    expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('');
    expect(theme.surfaceOpacity()).toBeUndefined();
  });

  it('começa no estilo Argila com a paleta nativa', () => {
    expect(theme.style()).toBe('argila');
    expect(theme.palette()).toBe('nativa');
  });

  it('lê estilo e paleta já presentes no <html>, ignorando valores desconhecidos', () => {
    root.setAttribute('data-arg-style', 'coda');
    root.setAttribute('data-arg-palette', 'nao-existe');
    TestBed.resetTestingModule();

    const fresh = TestBed.inject(ArgTheme);

    expect(fresh.style()).toBe('coda');
    expect(fresh.palette()).toBe('nativa');
  });

  it('aplica estilo e paleta como atributos no <html>', () => {
    theme.setStyle('windows-xp');
    theme.setPalette('alto-contraste');

    expect(root.getAttribute('data-arg-style')).toBe('windows-xp');
    expect(root.getAttribute('data-arg-palette')).toBe('alto-contraste');
    expect(theme.style()).toBe('windows-xp');
    expect(theme.palette()).toBe('alto-contraste');
  });

  it('ARG_STYLES e ARG_PALETTES vêm dos manifestos', () => {
    expect(Object.keys(ARG_STYLES)).toEqual(Object.keys(ARG_DESIGN_SYSTEMS));
    expect(ARG_STYLES['windows-xp'].schemes).toEqual(ARG_DESIGN_SYSTEMS['windows-xp'].modos);
    const accepted = Object.values(ARG_DESIGN_SYSTEMS).flatMap((ds) => [...ds.paletas]);
    expect([...ARG_PALETTES].sort()).toEqual([...new Set(accepted)].sort());
  });

  describe('o que o design system não aceita', () => {
    let warn: jest.SpiedFunction<typeof console.warn>;

    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    it('troca para a paleta padrão do design system novo e avisa', () => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        paletas: ['nativa'],
      } as never);
      theme.setPalette('terrosa');

      theme.setStyle('coda');

      expect(theme.palette()).toBe('nativa');
      expect(root.getAttribute('data-arg-palette')).toBe('nativa');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('não aceita a paleta "terrosa"'));
    });

    it('recusa uma paleta que o design system atual não aceita', () => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        paletas: ['nativa'],
      } as never);
      theme.setStyle('coda');

      theme.setPalette('terrosa');

      expect(theme.palette()).toBe('nativa');
      expect(theme.palettes()).toEqual(['nativa']);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('usando "nativa"'));
    });

    it('ao ler o <html>, troca uma paleta não aceita pela padrão', () => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        paletas: ['nativa'],
      } as never);
      root.setAttribute('data-arg-style', 'coda');
      root.setAttribute('data-arg-palette', 'terrosa');
      TestBed.resetTestingModule();

      expect(TestBed.inject(ArgTheme).palette()).toBe('nativa');
    });

    it('sem transparência no design system, ignora a opacidade e avisa', () => {
      theme.setStyle('windows-xp');

      theme.setSurfaceOpacity(0.6);

      expect(theme.acceptsTransparency()).toBe(false);
      expect(theme.surfaceOpacity()).toBeUndefined();
      expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('não aceita transparência'));
    });

    it('ao trocar para um design system sem transparência, volta as superfícies a opacas', () => {
      theme.setStyle('transparente');
      theme.setSurfaceOpacity(0.6);

      theme.setStyle('coda');

      expect(theme.surfaceOpacity()).toBeUndefined();
      expect(root.style.getPropertyValue('--arg-surface-opacity')).toBe('');
    });

    it('começa no fundo liso, sem atributo', () => {
      expect(theme.background()).toBe('liso');
      expect(root.hasAttribute('data-arg-background')).toBe(false);
    });

    it('aplica o fundo em degradê e volta ao liso', () => {
      theme.setBackground('degrade');
      expect(theme.background()).toBe('degrade');
      expect(root.getAttribute('data-arg-background')).toBe('degrade');

      theme.setBackground('liso');
      expect(root.hasAttribute('data-arg-background')).toBe(false);
    });

    it('recusa, com aviso, um fundo que o design system não aceita', () => {
      theme.setStyle('punk');

      theme.setBackground('degrade');

      expect(theme.backgrounds()).toEqual(['liso']);
      expect(theme.background()).toBe('liso');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('não aceita o fundo "degrade"'));
    });

    it('ao trocar para um design system sem o fundo atual, volta ao padrão dele', () => {
      theme.setBackground('degrade');

      theme.setStyle('neo-brutalista');

      expect(theme.background()).toBe('liso');
      expect(root.hasAttribute('data-arg-background')).toBe(false);
    });

    it('no Windows XP, as linhas são o padrão (sem atributo) e o liso vai no atributo', () => {
      theme.setStyle('windows-xp');
      expect(theme.backgrounds()).toEqual(['linhas', 'liso']);
      expect(theme.background()).toBe('linhas');
      expect(root.hasAttribute('data-arg-background')).toBe(false);

      theme.setBackground('liso');
      expect(root.getAttribute('data-arg-background')).toBe('liso');

      theme.setStyle('argila');
      expect(theme.background()).toBe('liso');
      expect(root.hasAttribute('data-arg-background')).toBe(false);
    });

    it('lê o fundo já presente no <html>, ignorando um que o DS não aceita', () => {
      root.setAttribute('data-arg-background', 'degrade');
      TestBed.resetTestingModule();
      expect(TestBed.inject(ArgTheme).background()).toBe('degrade');

      root.setAttribute('data-arg-background', 'linhas');
      TestBed.resetTestingModule();
      expect(TestBed.inject(ArgTheme).background()).toBe('liso');
    });

    describe('fundo de imagem', () => {
      afterEach(() => {
        theme.setBackgroundImage(undefined);
        theme.clearBackgroundVeil();
        theme.setBackgroundMotion(false);
      });

      it('aplica a imagem e o fundo imagem', () => {
        theme.setBackgroundImage('assets/fundo.jpg');
        theme.setBackground('imagem');

        expect(theme.backgroundImage()).toBe('assets/fundo.jpg');
        expect(theme.background()).toBe('imagem');
        expect(root.getAttribute('data-arg-background')).toBe('imagem');
        expect(root.style.getPropertyValue('--arg-background-photo')).toBe(
          'url("assets/fundo.jpg")',
        );
      });

      it('escapa aspas e barras da URL e tira quebras de linha', () => {
        theme.setBackgroundImage('a"b\\c\nd.jpg');

        expect(root.style.getPropertyValue('--arg-background-photo')).toBe(
          'url("a\\"b\\\\cd.jpg")',
        );
      });

      it('sem imagem, o fundo imagem vira o degradê, com aviso', () => {
        theme.setBackground('imagem');

        expect(theme.background()).toBe('degrade');
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('precisa de setBackgroundImage'));
      });

      it('tirar a imagem de um fundo imagem volta ao degradê', () => {
        theme.setBackgroundImage('assets/fundo.jpg');
        theme.setBackground('imagem');

        theme.setBackgroundImage(undefined);

        expect(theme.background()).toBe('degrade');
        expect(root.style.getPropertyValue('--arg-background-photo')).toBe('');
      });

      it('um design system sem o fundo imagem volta ao padrão dele', () => {
        theme.setBackgroundImage('assets/fundo.jpg');
        theme.setBackground('imagem');

        theme.setStyle('punk');

        expect(theme.background()).toBe('liso');
      });

      it('aplica o véu em porcentagem, preso entre 0 e 1, e volta ao padrão', () => {
        theme.setBackgroundVeil(0.555);
        expect(theme.backgroundVeil()).toBe(0.555);
        expect(root.style.getPropertyValue('--arg-background-veil')).toBe(
          'color-mix(in oklab, var(--arg-color-background) 55.5%, transparent)',
        );

        theme.setBackgroundVeil(2);
        expect(theme.backgroundVeil()).toBe(1);

        theme.clearBackgroundVeil();
        expect(theme.backgroundVeil()).toBeUndefined();
        expect(root.style.getPropertyValue('--arg-background-veil')).toBe('');
      });

      it('liga e desliga o movimento', () => {
        theme.setBackgroundMotion(true);
        expect(theme.backgroundMotion()).toBe(true);
        expect(root.hasAttribute('data-arg-background-motion')).toBe(true);

        theme.setBackgroundMotion(false);
        expect(theme.backgroundMotion()).toBe(false);
        expect(root.hasAttribute('data-arg-background-motion')).toBe(false);
      });

      describe('véu automático', () => {
        /** Imagem escura com um ponto claro; o tema escuro tem texto claro. */
        const IMAGE = new Uint8ClampedArray([...[10, 10, 20, 255], ...[120, 140, 200, 255]]);
        const COLORS: ArgVeilColors = {
          background: [17, 17, 17],
          texts: [[238, 238, 238]],
          spots: [],
        };
        let measurer: {
          imagePixels: jest.Mock<ArgVeilMeasurer['imagePixels']>;
          themeColors: jest.Mock<ArgVeilMeasurer['themeColors']>;
        };

        beforeEach(() => {
          measurer = {
            imagePixels: jest.fn(async () => IMAGE),
            themeColors: jest.fn(() => COLORS),
          };
          TestBed.resetTestingModule();
          TestBed.configureTestingModule({
            providers: [{ provide: ARG_VEIL_MEASURER, useValue: measurer }],
          });
          theme = TestBed.inject(ArgTheme);
        });

        /** Roda o efeito do véu e espera a medição (assíncrona) terminar. */
        async function settle() {
          TestBed.tick();
          for (let i = 0; i < 5; i++) await Promise.resolve();
        }

        const expected = argMinimumVeil(argImageExtremes(IMAGE), COLORS);

        it('mede a imagem e aplica o menor véu que passa no contraste', async () => {
          theme.setBackgroundImage('assets/fundo.jpg');
          theme.setBackground('imagem');
          await settle();

          expect(measurer.imagePixels).toHaveBeenCalledWith('assets/fundo.jpg');
          expect(theme.backgroundVeil()).toBe(expected);
          expect(theme.backgroundVeilFixed()).toBe(false);
          expect(root.style.getPropertyValue('--arg-background-veil')).toContain(
            `${Math.round(expected * 1000) / 10}%`,
          );
        });

        it('recalcula quando as cores mudam, sem medir a imagem de novo', async () => {
          theme.setBackgroundImage('assets/fundo.jpg');
          theme.setBackground('imagem');
          await settle();
          measurer.themeColors.mockReturnValue({ ...COLORS, texts: [[255, 255, 255]] });

          theme.setColorScheme('dark');
          await settle();

          expect(measurer.imagePixels).toHaveBeenCalledTimes(1);
          expect(measurer.themeColors).toHaveBeenCalledTimes(2);
          expect(theme.backgroundVeil()).toBeLessThanOrEqual(expected);
        });

        it('o véu fixado vence o calculado; limpar volta ao calculado', async () => {
          theme.setBackgroundImage('assets/fundo.jpg');
          theme.setBackground('imagem');
          theme.setBackgroundVeil(0.3);
          await settle();

          expect(theme.backgroundVeil()).toBe(0.3);
          expect(theme.backgroundVeilFixed()).toBe(true);

          theme.clearBackgroundVeil();
          await settle();
          expect(theme.backgroundVeil()).toBe(expected);
        });

        it('sem o fundo imagem, não mede nada e o véu fica no padrão', async () => {
          theme.setBackgroundImage('assets/fundo.jpg');
          theme.setBackground('degrade');
          await settle();

          expect(measurer.imagePixels).not.toHaveBeenCalled();
          expect(theme.backgroundVeil()).toBeUndefined();
        });

        it('imagem que não pode ser lida fica no véu padrão, com aviso', async () => {
          const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
          measurer.imagePixels.mockRejectedValue(new Error('tainted canvas'));
          theme.setBackgroundImage('https://outro.site/fundo.jpg');
          theme.setBackground('imagem');
          await settle();

          expect(theme.backgroundVeil()).toBeUndefined();
          expect(root.style.getPropertyValue('--arg-background-veil')).toBe('');
          expect(warn).toHaveBeenCalledWith(expect.stringContaining('não deu para medir a imagem'));
          warn.mockRestore();
        });

        it('só o cálculo mais recente vale: trocar de imagem no meio descarta o anterior', async () => {
          let release!: (pixels: Uint8ClampedArray) => void;
          measurer.imagePixels.mockImplementationOnce(
            () => new Promise((resolve) => (release = resolve)),
          );
          theme.setBackgroundImage('assets/lenta.jpg');
          theme.setBackground('imagem');
          TestBed.tick();
          theme.setBackgroundImage('assets/rapida.jpg');
          await settle();
          const fast = theme.backgroundVeil();

          release(new Uint8ClampedArray([255, 255, 255, 255]));
          await settle();

          expect(theme.backgroundVeil()).toBe(fast);
        });
      });
    });
  });

  describe('cores de marca da lista fixa', () => {
    let warn: jest.SpiedFunction<typeof console.warn>;

    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    it('aplica as cores permitidas como atributos no <html>', () => {
      theme.setColors({ primary: 'cobre', accent: 'mostarda' });

      expect(root.getAttribute('data-arg-primary')).toBe('cobre');
      expect(root.getAttribute('data-arg-accent')).toBe('mostarda');
      expect(root.hasAttribute('data-arg-secondary')).toBe(false);
      expect(theme.colors()).toEqual({ primary: 'cobre', accent: 'mostarda' });
    });

    it('as permitidas vêm da matriz gerada para o design system e a paleta', () => {
      theme.setStyle('windows-xp');

      expect(theme.allowedColors()).toEqual(ARG_ALLOWED_COLORS['windows-xp']['nativa']);
    });

    it('ignora, com aviso, uma cor que não passa no contraste na combinação atual', () => {
      theme.setStyle('windows-xp');
      const blocked = (Object.keys(ARG_BRAND_COLORS) as ArgBrandColor[]).find(
        (color) => !theme.allowedColors().primary.includes(color),
      )!;

      theme.setColors({ primary: blocked });

      expect(root.hasAttribute('data-arg-primary')).toBe(false);
      expect(theme.colors()).toEqual({});
      expect(warn).toHaveBeenCalledWith(expect.stringContaining(`a cor "${blocked}"`));
    });

    it('ao trocar de design system, tira a cor que deixou de passar', () => {
      theme.setStyle('windows-xp');
      const allowed = theme.allowedColors().primary;
      const color = ARG_ALLOWED_COLORS['argila']['nativa'].primary.find(
        (candidate) => !allowed.includes(candidate),
      )!;
      theme.setStyle('argila');
      theme.setColors({ primary: color });

      theme.setStyle('windows-xp');

      expect(theme.colors()).toEqual({});
      expect(root.hasAttribute('data-arg-primary')).toBe(false);
    });

    it('lê as cores já presentes no <html>, ignorando nomes desconhecidos', () => {
      root.setAttribute('data-arg-primary', 'cobre');
      root.setAttribute('data-arg-accent', 'roxo-neon');
      TestBed.resetTestingModule();

      expect(TestBed.inject(ArgTheme).colors()).toEqual({ primary: 'cobre' });
    });

    it('clearColors volta às cores da paleta', () => {
      theme.setColors({ primary: 'cobre' });

      theme.clearColors();

      expect(root.hasAttribute('data-arg-primary')).toBe(false);
      expect(theme.colors()).toEqual({});
    });
  });

  describe('estilo com um modo só', () => {
    beforeEach(() => {
      jest.replaceProperty(ARG_DESIGN_SYSTEMS, 'coda', {
        ...ARG_DESIGN_SYSTEMS.coda,
        modos: ['dark'],
      } as never);
    });

    afterEach(() => jest.restoreAllMocks());

    it('troca o modo para o do estilo e recusa os outros', () => {
      theme.setColorScheme('light');
      theme.setStyle('coda');

      expect(theme.schemes()).toEqual(['dark']);
      expect(theme.colorScheme()).toBe('dark');

      theme.setColorScheme('light');
      expect(root.getAttribute('data-arg-theme')).toBe('dark');
      theme.setColorScheme('auto');
      expect(theme.colorScheme()).toBe('dark');
    });
  });
});
