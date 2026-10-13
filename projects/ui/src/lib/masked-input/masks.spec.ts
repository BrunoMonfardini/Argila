import {
  applyMask,
  caretAfter,
  isComplete,
  isValidCep,
  isValidCnpj,
  isValidCpf,
  isValidPhone,
  significantBefore,
  unmask,
} from './masks';

describe('máscaras', () => {
  it('põem a máscara até onde o valor vai', () => {
    expect(applyMask('cpf', '1234')).toBe('123.4');
    expect(applyMask('cpf', '12345678909')).toBe('123.456.789-09');
    expect(applyMask('cnpj', '11222333000181')).toBe('11.222.333/0001-81');
    expect(applyMask('cep', '01310100')).toBe('01310-100');
    expect(applyMask('phone', '1123456789')).toBe('(11) 2345-6789');
    expect(applyMask('phone', '11912345678')).toBe('(11) 91234-5678');
    expect(applyMask('cpf', '')).toBe('');
  });

  it('tiram a máscara, ignoram o que não conta e cortam no máximo', () => {
    expect(unmask('cpf', '123.456.789-09')).toBe('12345678909');
    expect(unmask('cpf', '123.456.789-0999')).toBe('12345678909');
    expect(unmask('cep', 'abc01310-100')).toBe('01310100');
    // CNPJ alfanumérico: letras viram maiúsculas e contam
    expect(unmask('cnpj', '12.abc.345/01de-35')).toBe('12ABC34501DE35');
    expect(unmask('phone', '(11) 9 1234-5678')).toBe('11912345678');
  });

  it('dizem se o valor tem o tamanho certo', () => {
    expect(isComplete('cpf', '1234567890')).toBe(false);
    expect(isComplete('cpf', '12345678909')).toBe(true);
    expect(isComplete('phone', '1123456789')).toBe(true);
    expect(isComplete('phone', '11912345678')).toBe(true);
    expect(isComplete('phone', '119123456')).toBe(false);
  });

  it('acham a posição do cursor pelos caracteres que contam', () => {
    // "123.456.7" → depois do 4º caractere que conta fica depois do "4"
    expect(caretAfter('cpf', '123.456.7', 4)).toBe(5);
    expect(caretAfter('cpf', '123.456.7', 0)).toBe(0);
    expect(caretAfter('cpf', '123.456.7', 99)).toBe(9);
    expect(significantBefore('cpf', '123.456.7', 5)).toBe(4);
  });
});

describe('validação', () => {
  it('CPF: dígitos verificadores certos; repetidos e incompletos não valem', () => {
    expect(isValidCpf('12345678909')).toBe(true);
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('12345678900')).toBe(false);
    expect(isValidCpf('11111111111')).toBe(false);
    expect(isValidCpf('1234567890')).toBe(false);
  });

  it('CNPJ numérico e alfanumérico', () => {
    expect(isValidCnpj('11222333000181')).toBe(true);
    expect(isValidCnpj('11222333000182')).toBe(false);
    // Exemplo da Receita Federal para o CNPJ alfanumérico
    expect(isValidCnpj('12ABC34501DE35')).toBe(true);
    expect(isValidCnpj('12abc34501de35')).toBe(true);
    expect(isValidCnpj('12ABC34501DE36')).toBe(false);
    expect(isValidCnpj('00000000000000')).toBe(false);
    // Os dois últimos são sempre dígitos
    expect(isValidCnpj('12ABC34501DEAB')).toBe(false);
  });

  it('CEP com 8 dígitos', () => {
    expect(isValidCep('01310100')).toBe(true);
    expect(isValidCep('0131010')).toBe(false);
  });

  it('telefone: DDD sem zero; celular com 11 dígitos começa com 9', () => {
    expect(isValidPhone('1123456789')).toBe(true);
    expect(isValidPhone('11912345678')).toBe(true);
    expect(isValidPhone('11812345678')).toBe(false);
    expect(isValidPhone('0123456789')).toBe(false);
    expect(isValidPhone('1023456789')).toBe(false);
    expect(isValidPhone('112345678')).toBe(false);
  });
});
