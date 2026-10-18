import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ArgTheme } from '@brunomonfardini/ui';
import { provideDocRouter } from '../../app.routes';
import { DOC_MANIFEST, Manifest } from '../../manifest';
import { DOC_PAGES, DocPage } from '../../registry';
import { formatUpdatedAt } from './component-page';

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

const AGENDA: DocPage = {
  slug: 'agenda',
  title: 'Agenda',
  category: 'Componentes',
  summary: 'Grade de horários.',
  examples: [],
  whenToUse: ['Marcar horários'],
  whenNotToUse: ['Escolher uma data só'],
  keyboard: [{ key: 'Setas', action: 'Movem entre os horários' }],
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
    'Componentes/agenda': {
      slug: 'agenda',
      category: 'Componentes',
      file: 'projects/ui/src/lib/agenda/agenda.docs.ts',
      examples: {},
    },
    'Componentes/fake': {
      slug: 'fake',
      category: 'Componentes',
      file: 'fake.docs.ts',
      updatedAt: '2026-10-17T17:30:00Z',
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
        { provide: DOC_PAGES, useValue: [FAKE, AGENDA, MINIMAL] },
        { provide: DOC_MANIFEST, useValue: MANIFEST },
      ],
    });
    const harness = await RouterTestingHarness.create(url);
    return { harness, root: harness.routeNativeElement! };
  }

  afterEach(() => TestBed.inject(ArgTheme).setStyle('argila'));

  it('Visão geral: título, resumo, data e exemplos renderizados', async () => {
    const { root } = await open('/componentes/fake');

    expect(root.querySelector('h1')?.textContent).toBe('Fake');
    expect(root.querySelector('.doc-lead code')?.textContent).toBe('código');
    expect(root.querySelector('.doc-page__updated')?.textContent?.trim()).toBe(
      'Atualizado em 17/10/2026 às 14:30',
    );
    expect(root.querySelector('time')?.getAttribute('datetime')).toBe('2026-10-17T17:30:00Z');
    expect(root.querySelector('doc-fake-example button')?.textContent).toBe('Exemplo vivo');
    expect(root.textContent).toContain('Descrição do exemplo.');
    expect(root.textContent).not.toContain('Faça isto');
  });

  it('formata a data no horário de Brasília', () => {
    expect(formatUpdatedAt('2026-01-02T03:04:00Z')).toBe('02/01/2026 às 00:04');
  });

  it('as abas são links, com a aba ativa na URL', async () => {
    const { harness } = await open('/componentes/fake');
    // Com a aba na URL a rota é outra: a página é criada de novo
    const root = () => harness.routeNativeElement!;
    const tabs = () => Array.from(root().querySelectorAll<HTMLAnchorElement>('.doc-page__tabs a'));

    expect(root().querySelector('.doc-page__tabs')?.getAttribute('aria-label')).toBe(
      'Seções da página',
    );
    expect(tabs().map((a) => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
      ['Visão geral', '/componentes/fake'],
      ['Regras de uso', '/componentes/fake/uso'],
      ['Código', '/componentes/fake/codigo'],
      ['Acessibilidade', '/componentes/fake/acessibilidade'],
    ]);
    expect(tabs()[0].getAttribute('aria-current')).toBe('page');

    await harness.navigateByUrl('/componentes/fake/uso');
    expect(tabs()[1].getAttribute('aria-current')).toBe('page');
    expect(tabs()[0].getAttribute('aria-current')).toBeNull();
    expect(root().textContent).toContain('Faça isto');
    expect(root().textContent).toContain('Não faça aquilo');
    expect(root().querySelector('doc-fake-example')).toBeNull();

    await harness.navigateByUrl('/componentes/fake/acessibilidade');
    expect(root().textContent).toContain('Funciona no teclado');
  });

  it('aba que a página não tem é página não encontrada', async () => {
    const { root } = await open('/padroes/minimo/codigo');

    expect(root.querySelector('h1')?.textContent).toBe('Página não encontrada');
  });

  it('índice "Nesta página" com as seções da aba, linkando o título', async () => {
    const { root } = await open('/componentes/fake');
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('.doc-page__toc a'));

    expect(root.querySelector('.doc-page__toc')?.getAttribute('aria-labelledby')).toBe(
      'nesta-pagina',
    );
    expect(links.map((a) => a.textContent?.trim())).toEqual(['Playground', 'Exemplos', 'Básico']);
    expect(links[2].getAttribute('href')).toBe('/componentes/fake#exemplo-0');
  });

  it('quando usar, teclado e regras do DS escolhido', async () => {
    const { harness, root } = await open('/componentes/agenda/uso');
    TestBed.inject(ArgTheme).setStyle('punk');
    await harness.fixture.whenStable();

    expect(root.querySelector('#quando-usar')).not.toBeNull();
    expect(root.textContent).toContain('Marcar horários');
    expect(root.textContent).toContain('Escolher uma data só');
    expect(root.querySelector('#regras-do-ds')?.textContent).toBe('Regras do Punk');

    await harness.navigateByUrl('/componentes/agenda/acessibilidade');
    expect(root.querySelector('#teclado ~ .doc-table kbd')?.textContent).toBe('Setas');
  });

  it('"Disponível em" com a situação em cada DS, e aviso nos herdados', async () => {
    const { root } = await open('/componentes/agenda');
    const items = Array.from(root.querySelectorAll('.doc-page__availability li'), (li) =>
      li.textContent?.trim(),
    );

    expect(items).toContain('Punk: curado');
    expect(items).toContain('Windows XP: fora');
    expect(items).toContain('Argila: herdado, sem curadoria');
    expect(root.querySelector('[arg-alert]')?.textContent).toContain('Sem curadoria no Argila');
  });

  it('fora do DS: aviso com os DS que o têm, e trocar mostra a página', async () => {
    const { harness, root } = await open('/componentes/agenda');
    const theme = TestBed.inject(ArgTheme);
    theme.setStyle('windows-xp');
    await harness.fixture.whenStable();

    expect(root.textContent).toContain('Este componente não faz parte do Windows XP.');
    expect(root.querySelector('.doc-page__tabs')).toBeNull();
    const punk = Array.from(
      root.querySelectorAll<HTMLButtonElement>('.doc-page__switch button'),
    ).find((b) => b.textContent?.trim() === 'Punk')!;

    punk.click();
    await harness.fixture.whenStable();

    expect(theme.style()).toBe('punk');
    expect(root.textContent).not.toContain('não faz parte');
    expect(root.querySelector('.doc-page__tabs')).not.toBeNull();
  });

  it('página sem componente não mostra "Disponível em" nem abas', async () => {
    const { root } = await open('/padroes/minimo');

    expect(root.querySelector('.doc-page__availability')).toBeNull();
    expect(root.querySelector('.doc-page__tabs')).toBeNull();
    expect(root.querySelector('.doc-page__toc')).toBeNull();
    expect(root.querySelector('.doc-page__updated')).toBeNull();
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
    const { root } = await open('/componentes/fake/codigo');

    const rows = Array.from(root.querySelectorAll('#propriedades ~ .doc-table tbody tr'));
    const cells = rows.map((row) => Array.from(row.children, (cell) => cell.textContent?.trim()));

    expect(root.textContent).toContain('arg-fake');
    expect(cells[0]).toEqual(['tone', "'calm' | 'loud'", "'calm'", 'Tom da amostra.']);
    expect(cells[1].slice(1)).toEqual(['string', '—', '']);
    expect(rows[1].querySelector('.doc-table__required')?.textContent).toBe('obrigatória');
    expect(rows[0].querySelector('.doc-table__required')).toBeNull();
  });

  it('lista os tokens do componente', async () => {
    const { root } = await open('/componentes/fake/codigo');

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
