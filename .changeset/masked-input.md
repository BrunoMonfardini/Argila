---
'@brunomonfardini/ui': minor
---

Componente `input[arg-mask]` para CPF, CNPJ (inclusive o alfanumérico de 2026), CEP e telefone: mostra o valor com máscara, entrega ao formulário só os caracteres que contam e mantém o cursor no lugar ao editar no meio. Com Reactive Forms, valida sozinho (`incomplete`, `cpf`, `cnpj`, `cep`, `phone`); para formulários de signals, as funções `isValidCpf`, `isValidCnpj`, `isValidCep` e `isValidPhone`. Também `applyMask` e `unmask`.
