import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArgIdGenerator, injectUniqueId } from './unique-id';

@Component({ selector: 'arg-id-host', template: '' })
class IdHost {
  readonly hint = injectUniqueId('arg-field-hint');
  readonly plain = injectUniqueId();
}

describe('injectUniqueId', () => {
  it('gera ids diferentes em cada instância, com o prefixo pedido', () => {
    const first = TestBed.createComponent(IdHost).componentInstance;
    const second = TestBed.createComponent(IdHost).componentInstance;

    expect(first.hint).toBe('arg-field-hint-1');
    expect(first.plain).toBe('arg-2');
    expect(second.hint).toBe('arg-field-hint-3');
  });

  it('recomeça a contagem em cada aplicação, para o SSR gerar os mesmos ids', () => {
    const before = TestBed.inject(ArgIdGenerator).next('x');
    TestBed.resetTestingModule();

    const after = TestBed.inject(ArgIdGenerator).next('x');

    expect(before).toBe('x-1');
    expect(after).toBe('x-1');
  });
});
