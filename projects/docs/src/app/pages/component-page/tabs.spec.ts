import { Component } from '@angular/core';
import type { DocPage } from '../../registry';
import { pageTabs, tableOfContents } from './tabs';

@Component({ template: '' })
class Example {}

const BASE: DocPage = { slug: 'x', title: 'X', category: 'Componentes', summary: '', examples: [] };
const OPTIONS = { playground: false, tokens: false, dsRules: false };

describe('abas e índice da página', () => {
  const ids = (page: DocPage, hasComponent = false, status?: 'curado') =>
    pageTabs(page, hasComponent, status).map((tab) => tab.id);

  it('só a Visão geral numa página de texto', () => {
    expect(ids(BASE)).toEqual(['visao-geral']);
  });

  it('cada aba aparece quando a página tem o conteúdo dela', () => {
    expect(ids({ ...BASE, guidelines: { do: [], dont: [] } })).toEqual(['visao-geral', 'uso']);
    expect(ids({ ...BASE, whenToUse: ['a'] })).toEqual(['visao-geral', 'uso']);
    expect(ids(BASE, true)).toEqual(['visao-geral', 'codigo']);
    expect(ids({ ...BASE, keyboard: [{ key: 'Esc', action: 'fecha' }] })).toEqual([
      'visao-geral',
      'acessibilidade',
    ]);
  });

  it('página de componente tem Regras de uso, com as regras do DS', () => {
    expect(ids(BASE, false, 'curado')).toEqual(['visao-geral', 'uso']);
  });

  it('as abas têm o caminho da URL; a Visão geral, nenhum', () => {
    const tabs = pageTabs({ ...BASE, accessibility: ['a'] }, true, 'curado');

    expect(tabs.map((tab) => [tab.label, tab.path])).toEqual([
      ['Visão geral', ''],
      ['Regras de uso', 'uso'],
      ['Código', 'codigo'],
      ['Acessibilidade', 'acessibilidade'],
    ]);
  });

  it('índice da Visão geral: seções de texto, playground, exemplos e cada exemplo', () => {
    const page: DocPage = {
      ...BASE,
      content: [{ heading: 'Sobre', body: [] }],
      examples: [
        { name: 'Básico', component: Example },
        { name: 'Tamanhos', component: Example },
      ],
    };

    expect(tableOfContents(page, 'visao-geral', { ...OPTIONS, playground: true })).toEqual([
      { id: 'secao-0', label: 'Sobre', level: 2 },
      { id: 'playground', label: 'Playground', level: 2 },
      { id: 'exemplos', label: 'Exemplos', level: 2 },
      { id: 'exemplo-0', label: 'Básico', level: 3 },
      { id: 'exemplo-1', label: 'Tamanhos', level: 3 },
    ]);
    expect(tableOfContents(BASE, 'visao-geral', OPTIONS)).toEqual([]);
  });

  it('índice das outras abas, só com o que existe', () => {
    const page: DocPage = {
      ...BASE,
      whenNotToUse: ['b'],
      guidelines: { do: [], dont: [] },
      keyboard: [{ key: 'Tab', action: 'move' }],
    };
    const labels = (tab: Parameters<typeof tableOfContents>[1], options = OPTIONS) =>
      tableOfContents(page, tab, options).map((entry) => entry.id);

    expect(labels('uso', { ...OPTIONS, dsRules: true })).toEqual([
      'quando-usar',
      'uso',
      'regras-do-ds',
    ]);
    expect(labels('codigo')).toEqual(['propriedades']);
    expect(labels('codigo', { ...OPTIONS, tokens: true })).toEqual([
      'propriedades',
      'tokens-do-componente',
    ]);
    expect(labels('acessibilidade')).toEqual(['teclado']);
    expect(tableOfContents({ ...BASE, accessibility: ['a'] }, 'acessibilidade', OPTIONS)).toEqual([
      { id: 'acessibilidade', label: 'Leitor de tela e contraste', level: 2 },
    ]);
  });
});
