import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ArgTheme, provideArgila } from '@brunomonfardini/ui';
import { DOC_SEGMENTS } from '../segments';
import { DOC_SAMPLE_BACKGROUND, DocThemeChoices } from './theme-choices';

@Component({ template: '' })
class Blank {}

describe('DocThemeChoices', () => {
  const root = document.documentElement;

  beforeEach(() => {
    localStorage.clear();
    for (const name of [
      'data-arg-style',
      'data-arg-palette',
      'data-arg-background',
      'data-arg-background-motion',
      'data-arg-primary',
      'data-arg-accent',
    ]) {
      root.removeAttribute(name);
    }
    root.style.removeProperty('--arg-surface-opacity');
    root.style.removeProperty('--arg-background-photo');
    root.setAttribute('data-arg-theme', 'auto');
    history.replaceState(null, '', '/');
  });

  /** O app abre em `url`: o estado vem do link e a navegação inicial acontece. */
  async function open(url = '/') {
    history.replaceState(null, '', url);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Blank },
          { path: 'outra', component: Blank },
        ]),
        provideArgila({ segments: DOC_SEGMENTS }),
      ],
    });
    const choices = TestBed.inject(DocThemeChoices);
    const router = TestBed.inject(Router);
    choices.restore();
    await router.navigateByUrl(url);
    return { choices, router, theme: TestBed.inject(ArgTheme) };
  }

  it('o link reproduz a combinação: DS, paleta, modo, cores e transparência', async () => {
    const { theme, choices } = await open(
      '/?ds=transparente&paleta=oceano&modo=dark&primaria=anil&opacidade=70',
    );

    expect(theme.style()).toBe('transparente');
    expect(theme.palette()).toBe('oceano');
    expect(theme.colorScheme()).toBe('dark');
    expect(theme.colors()).toEqual({ primary: 'anil' });
    expect(theme.surfaceOpacity()).toBe(0.7);
    expect(choices.notice()).toBeUndefined();
  });

  it('o link leva o fundo, e o fundo que o DS não aceita avisa', async () => {
    const { theme, choices } = await open('/?ds=transparente&fundo=degrade');
    expect(theme.background()).toBe('degrade');
    expect(root.getAttribute('data-arg-background')).toBe('degrade');
    expect(localStorage.getItem('argila-docs:fundo')).toBe('degrade');
    expect(choices.notice()).toBeUndefined();
    TestBed.resetTestingModule();

    const punk = await open('/?ds=punk&fundo=degrade');
    expect(punk.theme.background()).toBe('liso');
    expect(punk.choices.notice()).toEqual(['O Punk não aceita o fundo “degrade”; usamos o liso.']);
  });

  it('o fundo imagem usa a imagem de exemplo, e o movimento vai e volta pelo link', async () => {
    const { theme, router } = await open('/?ds=transparente&fundo=imagem&movimento=1');

    expect(theme.background()).toBe('imagem');
    expect(theme.backgroundImage()).toBe(DOC_SAMPLE_BACKGROUND);
    expect(theme.backgroundMotion()).toBe(true);
    expect(root.hasAttribute('data-arg-background-motion')).toBe(true);
    expect(localStorage.getItem('argila-docs:movimento')).toBe('1');

    TestBed.inject(DocThemeChoices).selectMotion(false);
    await new Promise((resolve) => setTimeout(resolve));

    expect(theme.backgroundMotion()).toBe(false);
    expect(router.url).not.toContain('movimento');
    expect(localStorage.getItem('argila-docs:movimento')).toBe('');
  });

  it('o link vale mais que o salvo no navegador', async () => {
    localStorage.setItem('argila-docs:estilo', 'coda');
    const { theme } = await open('/?ds=punk');

    expect(theme.style()).toBe('punk');
    expect(localStorage.getItem('argila-docs:estilo')).toBe('punk');
  });

  it('link inválido cai no padrão do DS, com uma frase de aviso por escolha', async () => {
    const { theme, choices } = await open(
      '/?ds=punk&paleta=terrosa&modo=light&primaria=lilas&opacidade=50',
    );

    expect(theme.style()).toBe('punk');
    expect(theme.palette()).toBe('nativa');
    expect(theme.colorScheme()).toBe('dark');
    expect(theme.colors()).toEqual({});
    expect(theme.surfaceOpacity()).toBeUndefined();
    expect(choices.notice()).toEqual([
      'O Punk não aceita a paleta “terrosa”; usamos a padrão dele.',
      'O Punk não tem o modo “light”.',
      'A cor “lilas” não vale como primária aqui; usamos a da paleta.',
      'O Punk não aceita transparência.',
    ]);

    choices.dismissNotice();
    expect(choices.notice()).toBeUndefined();
  });

  it('DS, segmento e opacidade desconhecidos também avisam', async () => {
    const { theme, choices } = await open('/?ds=arcade&opacidade=10&segmento=gold');

    expect(theme.style()).toBe('argila');
    expect(choices.notice()).toEqual([
      'O segmento “gold” não existe.',
      'O design system “arcade” não existe; usamos o padrão.',
      'A opacidade “10” não vale; usamos a do design system.',
    ]);
  });

  it('o salvo no navegador não avisa nada, mesmo inválido', async () => {
    localStorage.setItem('argila-docs:estilo', 'punk');
    localStorage.setItem('argila-docs:paleta', 'terrosa');
    localStorage.setItem('argila-docs:cores', 'primaria:cobre,xpto:anil');
    const { theme, choices } = await open();

    expect(theme.style()).toBe('punk');
    expect(theme.palette()).toBe('nativa');
    expect(choices.notice()).toBeUndefined();
  });

  it('as escolhas vão para a URL, só o que difere do padrão', async () => {
    const { choices, router } = await open();
    expect(router.url).toBe('/');

    choices.selectStyle('coda');
    choices.selectPalette('viva');
    choices.selectColor('accent', 'mostarda');
    await new Promise((resolve) => setTimeout(resolve));

    expect(router.url).toBe('/?ds=coda&paleta=viva&destaque=mostarda');

    choices.selectStyle('argila');
    choices.selectColor('accent', undefined);
    await new Promise((resolve) => setTimeout(resolve));
    expect(router.url).toBe('/');
  });

  it('um link interno sem as escolhas as recebe de volta', async () => {
    const { choices, router } = await open('/?ds=punk');
    expect(choices).toBeDefined();

    await router.navigateByUrl('/outra');
    await new Promise((resolve) => setTimeout(resolve));

    expect(router.url).toBe('/outra?ds=punk');
  });

  it('segmento vai para a URL pelo nome e é restaurado pelo link', async () => {
    const { choices, router, theme } = await open();

    choices.selectSegment('vibrante');
    await new Promise((resolve) => setTimeout(resolve));
    expect(router.url).toBe('/?segmento=vibrante');
    expect(theme.style()).toBe('punk');

    TestBed.resetTestingModule();
    const again = await open('/?segmento=premium');
    expect(again.theme.palette()).toBe('terrosa');
    expect(again.choices.segment()).toBe('premium');
  });
});
