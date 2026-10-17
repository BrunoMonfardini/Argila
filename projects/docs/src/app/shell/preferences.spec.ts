import { jest } from '@jest/globals';
import { readPreference, writePreference } from './preferences';

describe('preferências do catálogo', () => {
  const options = [{ value: 'a' }, { value: 'b' }] as const;

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('lê só valores permitidos', () => {
    writePreference('chave', 'b');
    expect(readPreference('chave', options)).toBe('b');

    writePreference('chave', 'z');
    expect(readPreference('chave', options)).toBeUndefined();
  });

  it('segue sem erro quando o armazenamento está bloqueado', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });

    expect(() => writePreference('chave', 'a')).not.toThrow();
    expect(readPreference('chave', options)).toBeUndefined();
  });
});
