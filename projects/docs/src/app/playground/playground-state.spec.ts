import { ManifestInput } from '../manifest';
import {
  controllableInputs,
  defaultValues,
  parseDefault,
  parseQueryValue,
  playgroundSnippet,
  queryFromValues,
  valuesFromQuery,
} from './playground-state';

function prop(
  partial: Partial<ManifestInput> & Pick<ManifestInput, 'name' | 'control'>,
): ManifestInput {
  return { type: '', required: false, description: '', ...partial };
}

const VARIANT = prop({
  name: 'variant',
  control: 'options',
  options: ['primary', 'danger'],
  defaultValue: "'primary'",
});
const LOADING = prop({ name: 'loading', control: 'boolean', defaultValue: 'false' });
const ANIMATED = prop({ name: 'animated', control: 'boolean', defaultValue: 'true' });
const COUNT = prop({ name: 'count', control: 'number', defaultValue: '3' });
const LABEL = prop({ name: 'label', control: 'string', defaultValue: '"Carregando"' });
const WIDTH = prop({ name: 'width', control: 'string' });
const ITEMS = prop({ name: 'items', control: 'other', defaultValue: '[]' });
const NAME = prop({ name: 'name', control: 'options', options: ['plus', 'x'], required: true });
const INPUTS = [VARIANT, LOADING, ANIMATED, COUNT, LABEL, WIDTH, ITEMS];

describe('estado do playground', () => {
  it('ignora inputs sem controle', () => {
    expect(controllableInputs(INPUTS)).not.toContain(ITEMS);
  });

  it('lê padrões literais do código', () => {
    expect(parseDefault(VARIANT)).toBe('primary');
    expect(parseDefault(LOADING)).toBe(false);
    expect(parseDefault(ANIMATED)).toBe(true);
    expect(parseDefault(COUNT)).toBe(3);
    expect(parseDefault(LABEL)).toBe('Carregando');
    expect(parseDefault(WIDTH)).toBeUndefined();
    expect(
      parseDefault(prop({ name: 'x', control: 'string', defaultValue: 'OUTRA' })),
    ).toBeUndefined();
  });

  it('usa a primeira opção em input obrigatória sem padrão', () => {
    expect(parseDefault(NAME)).toBe('plus');
    expect(parseDefault(prop({ name: 'id', control: 'string', required: true }))).toBeUndefined();
  });

  it('aplica os valores iniciais da página sobre os padrões', () => {
    expect(defaultValues(INPUTS, { width: '16rem' })).toEqual({
      variant: 'primary',
      loading: false,
      animated: true,
      count: 3,
      label: 'Carregando',
      width: '16rem',
    });
  });

  it('converte texto da URL no tipo da input e ignora o inválido', () => {
    expect(parseQueryValue(LOADING, 'true')).toBe(true);
    expect(parseQueryValue(LOADING, 'false')).toBe(false);
    expect(parseQueryValue(LOADING, 'sim')).toBeUndefined();
    expect(parseQueryValue(COUNT, '7')).toBe(7);
    expect(parseQueryValue(COUNT, 'abc')).toBeUndefined();
    expect(parseQueryValue(COUNT, ' ')).toBeUndefined();
    expect(parseQueryValue(VARIANT, 'danger')).toBe('danger');
    expect(parseQueryValue(VARIANT, 'roxo')).toBeUndefined();
    expect(parseQueryValue(LABEL, 'Salvando')).toBe('Salvando');
  });

  it('monta o estado inicial com a URL sobre os padrões', () => {
    const defaults = defaultValues(INPUTS);

    const values = valuesFromQuery(INPUTS, defaults, {
      variant: 'danger',
      loading: 'nao',
      count: '5',
      outra: 'x',
      items: '[1]',
    });

    expect(values).toEqual({ ...defaults, variant: 'danger', count: 5 });
  });

  it('põe na URL só o que difere do padrão', () => {
    const defaults = defaultValues(INPUTS);

    const query = queryFromValues({ ...defaults, variant: 'danger', width: undefined }, defaults);

    expect(query).toEqual({
      variant: 'danger',
      loading: null,
      animated: null,
      count: null,
      label: null,
      width: null,
    });
  });
});

describe('playgroundSnippet', () => {
  const defaults = defaultValues(INPUTS);

  it('escreve o componente de atributo com o conteúdo e só o que mudou', () => {
    const values = { ...defaults, variant: 'danger', loading: true, count: 5 };

    expect(playgroundSnippet('button[arg-button], a[arg-button]', values, defaults, 'Salvar')).toBe(
      '<button arg-button variant="danger" loading [count]="5">Salvar</button>',
    );
  });

  it('fecha o componente de elemento sem conteúdo e explicita false quando o padrão é true', () => {
    const values = { ...defaults, animated: false };

    expect(playgroundSnippet('arg-skeleton', values, defaults)).toBe(
      '<arg-skeleton [animated]="false" />',
    );
  });

  it('sempre mostra as inputs obrigatórias', () => {
    const values = { name: 'plus' };

    expect(playgroundSnippet('arg-icon', values, { name: 'plus' }, '', ['name'])).toBe(
      '<arg-icon name="plus" />',
    );
  });

  it('usa div quando o seletor só tem atributo', () => {
    expect(playgroundSnippet('[argTooltip]', {}, {})).toBe('<div argTooltip></div>');
  });
});
