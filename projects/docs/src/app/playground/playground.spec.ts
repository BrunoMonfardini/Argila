import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideDocRouter } from '../app.routes';
import { DOC_MANIFEST, Manifest } from '../manifest';
import { DOC_PAGES, DocPage } from '../registry';

@Component({
  selector: 'button[arg-fake]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: { '[attr.data-tone]': 'tone()', '[class.loud]': 'loud()', '[attr.data-size]': 'size()' },
})
class FakeButton {
  readonly tone = input<'calm' | 'warm'>('calm');
  readonly loud = input(false, { transform: booleanAttribute });
  readonly size = input(1);
}

@Component({ selector: 'arg-other', template: 'outro' })
class Other {}

const BUTTON: DocPage = {
  slug: 'fake',
  title: 'Fake',
  category: 'Componentes',
  summary: '',
  component: FakeButton,
  hostElement: 'button',
  playgroundContent: 'Salvar',
  examples: [],
};
const OTHER: DocPage = { ...BUTTON, slug: 'other', component: Other, hostElement: undefined };
const HIDDEN: DocPage = { ...BUTTON, slug: 'hidden', playground: false };

const COMPONENT = {
  className: 'FakeButton',
  selector: 'button[arg-fake]',
  file: 'fake.ts',
  cssTokens: [],
  inputs: [
    {
      name: 'tone',
      type: "'calm' | 'warm'",
      control: 'options' as const,
      options: ['calm', 'warm'],
      defaultValue: "'calm'",
      required: false,
      description: '',
    },
    {
      name: 'loud',
      type: 'boolean',
      control: 'boolean' as const,
      defaultValue: 'false',
      required: false,
      description: '',
    },
    {
      name: 'size',
      type: 'number',
      control: 'number' as const,
      defaultValue: '1',
      required: false,
      description: '',
    },
  ],
};

const MANIFEST: Manifest = {
  tokens: [],
  pages: {
    'Componentes/fake': {
      slug: 'fake',
      category: 'Componentes',
      file: '',
      examples: {},
      component: COMPONENT,
    },
    'Componentes/hidden': {
      slug: 'hidden',
      category: 'Componentes',
      file: '',
      examples: {},
      component: COMPONENT,
    },
    'Componentes/other': {
      slug: 'other',
      category: 'Componentes',
      file: '',
      examples: {},
      component: { ...COMPONENT, selector: 'arg-other', inputs: [] },
    },
  },
};

describe('DocPlayground', () => {
  async function open(url: string) {
    TestBed.configureTestingModule({
      providers: [
        provideDocRouter(),
        { provide: DOC_PAGES, useValue: [BUTTON, OTHER, HIDDEN] },
        { provide: DOC_MANIFEST, useValue: MANIFEST },
      ],
    });
    const harness = await RouterTestingHarness.create(url);
    const root = harness.routeNativeElement!;
    const live = () => root.querySelector<HTMLElement>('.doc-playground__stage > *')!;
    const snippet = () => root.querySelector('doc-playground doc-code pre')?.textContent;
    return { harness, root, live, snippet };
  }

  it('renderiza o componente no elemento hospedeiro, com o conteúdo projetado', async () => {
    const { live, snippet } = await open('/componentes/fake');

    expect(live().tagName).toBe('BUTTON');
    expect(live().textContent).toBe('Salvar');
    expect(live().getAttribute('data-tone')).toBe('calm');
    expect(snippet()).toBe('<button arg-fake>Salvar</button>');
  });

  it('gera um controle por input, do tipo certo', async () => {
    const { root } = await open('/componentes/fake');

    expect(root.querySelectorAll('input[type="radio"][name="pg-tone"]').length).toBe(2);
    expect(root.querySelector('fieldset legend')?.textContent).toBe('tone');
    expect(root.querySelectorAll('input[type="checkbox"]').length).toBe(1);
    expect(root.querySelectorAll('input[type="number"]').length).toBe(1);
  });

  it('lê o estado inicial da URL', async () => {
    const { root, live } = await open('/componentes/fake?tone=warm&loud=true&size=3');

    expect(live().getAttribute('data-tone')).toBe('warm');
    expect(live().classList).toContain('loud');
    expect(live().getAttribute('data-size')).toBe('3');
    expect(root.querySelector<HTMLInputElement>('input[value="warm"]')!.checked).toBe(true);
  });

  it('atualiza o componente, o código e a URL quando um controle muda', async () => {
    const { harness, root, live, snippet } = await open('/componentes/fake');

    root.querySelector<HTMLInputElement>('input[value="warm"]')!.click();
    const check = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    check.click();
    const size = root.querySelector<HTMLInputElement>('input[type="number"]')!;
    size.value = '4';
    size.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();

    expect(live().getAttribute('data-tone')).toBe('warm');
    expect(live().classList).toContain('loud');
    expect(snippet()).toBe('<button arg-fake tone="warm" loud [size]="4">Salvar</button>');
    expect(TestBed.inject(Router).url).toBe('/componentes/fake?tone=warm&loud=true&size=4');
  });

  it('número apagado volta a não ter valor', async () => {
    const { harness, root } = await open('/componentes/fake?size=3');
    const size = root.querySelector<HTMLInputElement>('input[type="number"]')!;

    size.value = '';
    size.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/componentes/fake');
  });

  it('restaura os padrões e limpa a URL', async () => {
    const { harness, root, live } = await open('/componentes/fake?tone=warm');

    root.querySelector<HTMLButtonElement>('.doc-playground__reset')!.click();
    await harness.fixture.whenStable();

    expect(live().getAttribute('data-tone')).toBe('calm');
    expect(TestBed.inject(Router).url).toBe('/componentes/fake');
  });

  it('recria o componente ao trocar de página e usa o seletor quando não há hospedeiro', async () => {
    const { harness, root, live } = await open('/componentes/fake');

    await harness.navigateByUrl('/componentes/other');

    expect(live().tagName).toBe('ARG-OTHER');
    expect(root.querySelectorAll('.doc-playground__stage > *').length).toBe(1);
  });

  it('não aparece quando a página desliga o playground', async () => {
    const { root } = await open('/componentes/hidden');

    expect(root.querySelector('doc-playground')).toBeNull();
  });
});
