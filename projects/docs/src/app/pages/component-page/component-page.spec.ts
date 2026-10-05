import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideDocRouter } from '../../app.routes';
import { DOC_MANIFEST, Manifest } from '../../manifest';
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

const MANIFEST: Manifest = {
  tokens: [],
  pages: {
    'Componentes/fake': {
      slug: 'fake',
      category: 'Componentes',
      file: 'fake.docs.ts',
      examples: { Básico: "@Component({ template: '<button>Exemplo vivo</button>' })" },
      component: {
        className: 'ArgFake',
        selector: 'arg-fake',
        file: 'fake.ts',
        inputs: [
          {
            name: 'tone',
            type: "'calm' | 'loud'",
            control: 'options',
            options: ['calm', 'loud'],
            defaultValue: "'calm'",
            required: false,
            description: 'Tom da `amostra`.',
          },
          { name: 'id', type: 'string', control: 'string', required: true, description: '' },
        ],
        cssTokens: [{ name: '--arg-fake-gap', value: 'var(--arg-space-2)' }],
      },
    },
  },
};

describe('ComponentPage', () => {
  async function open(url: string) {
    TestBed.configureTestingModule({
      providers: [
        provideDocRouter(),
        { provide: DOC_PAGES, useValue: [FAKE, MINIMAL] },
        { provide: DOC_MANIFEST, useValue: MANIFEST },
      ],
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

  it('mostra a tabela de propriedades com tipo, padrão, obrigatoriedade e descrição', async () => {
    const { root } = await open('/componentes/fake');

    const rows = Array.from(root.querySelectorAll('#propriedades ~ .doc-table tbody tr'));
    const cells = rows.map((row) => Array.from(row.children, (cell) => cell.textContent?.trim()));

    expect(root.textContent).toContain('arg-fake');
    expect(cells[0]).toEqual(['tone', "'calm' | 'loud'", "'calm'", 'Tom da amostra.']);
    expect(cells[1].slice(1)).toEqual(['string', '—', '']);
    expect(rows[1].querySelector('.doc-table__required')?.textContent).toBe('obrigatória');
    expect(rows[0].querySelector('.doc-table__required')).toBeNull();
  });

  it('lista os tokens do componente', async () => {
    const { root } = await open('/componentes/fake');

    const table = root.querySelector('#tokens-do-componente ~ .doc-table')!;

    expect(table.textContent).toContain('--arg-fake-gap');
    expect(table.textContent).toContain('var(--arg-space-2)');
  });

  it('mostra o código do exemplo, vindo do manifesto, ao pedir', async () => {
    const { harness, root } = await open('/componentes/fake');
    const toggle = root.querySelector<HTMLButtonElement>('.doc-example__toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('doc-code')).toBeNull();

    toggle.click();
    await harness.fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.textContent?.trim()).toBe('Esconder código');
    expect(root.querySelector('doc-code pre')?.textContent).toContain('Exemplo vivo');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).not.toBeNull();
  });

  it('sem manifesto para a página, não mostra propriedades nem botão de código', async () => {
    const { root } = await open('/padroes/minimo');

    expect(root.querySelector('#propriedades')).toBeNull();
    expect(root.querySelector('.doc-example__toggle')).toBeNull();
  });
});
