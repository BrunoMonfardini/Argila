# Changesets

Toda mudança visível para quem consome o `@brunomonfardini/ui` precisa de um changeset:

```sh
pnpm changeset
```

Escolha o tipo pelo impacto: `patch` (correção), `minor` (componente ou opção nova),
`major` (quebra de compatibilidade, com nota de migração no texto do changeset).
