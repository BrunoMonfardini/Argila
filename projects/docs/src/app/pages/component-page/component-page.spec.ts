import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideDocRouter } from '../../app.routes';
import { DOC_PAGES, DocPage } from '../../registry';

@Component({
  selector: 'doc-fake-example',
  template: '<button type="button">Exemplo vivo</button>',
})
class FakeExample {}

const FAKE: DocPage = {
  slug: 'fake',
  title: 'Fake',
  category: 'Componentes',
  summary: 'Resumo com `código`.',
  examples: [{ name: 'Básico', description: 'Descrição do exemplo.', component: FakeExample }],
  guidelines: { do: ['Faça isto'], dont: ['Não faça aquilo'] },
  accessibility: ['Funciona no teclado'],
};

const MINIMAL: DocPage = {
  slug: 'minimo',
  title: 'Mínimo',
  category: 'Padrões',
  summary: 'Só o resumo.',
  examples: [],
};

describe('ComponentPage', () => {
  async function open(url: string) {
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), { provide: DOC_PAGES, useValue: [FAKE, MINIMAL] }],
    });
    const harness = await RouterTestingHarness.create(url);
    return { harness, root: harness.routeNativeElement! };
  }

  it('mostra título, resumo, exemplos renderizados, uso e acessibilidade', async () => {
    const { root } = await open('/componentes/fake');

    expect(root.querySelector('h1')?.textContent).toBe('Fake');
    expect(root.querySelector('.doc-lead code')?.textContent).toBe('código');
    expect(root.querySelector('doc-fake-example button')?.textContent).toBe('Exemplo vivo');
    expect(root.textContent).toContain('Descrição do exemplo.');
    expect(root.textContent).toContain('Faça isto');
    expect(root.textContent).toContain('Não faça aquilo');
    expect(root.textContent).toContain('Funciona no teclado');
  });

  it('nomeia a área de cada exemplo pelo título', async () => {
    const { root } = await open('/componentes/fake');

    const preview = root.querySelector('.doc-example__preview')!;
    const heading = root.querySelector(`#${preview.getAttribute('aria-labelledby')}`);

    expect(heading?.textContent).toBe('Básico');
  });

  it('omite as seções que a página não tem', async () => {
    const { root } = await open('/padroes/minimo');

    expect(root.querySelector('h1')?.textContent).toBe('Mínimo');
    expect(root.querySelector('#exemplos')).toBeNull();
    expect(root.querySelector('#uso')).toBeNull();
    expect(root.querySelector('#acessibilidade')).toBeNull();
  });

  it('avisa quando a página não existe', async () => {
    const { root } = await open('/componentes/nao-existe');

    expect(root.querySelector('h1')?.textContent).toBe('Página não encontrada');
  });

  it('põe o título da página na aba do navegador', async () => {
    await open('/componentes/fake');
    expect(document.title).toBe('Fake · Argila');

    await TestBed.inject(Router).navigateByUrl('/componentes/outra');
    expect(document.title).toBe('Página não encontrada · Argila');
  });
});
