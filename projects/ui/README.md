# @argila/ui

Componentes Angular acessíveis e temas por cliente via design tokens.

## Instalação

```sh
pnpm add @argila/ui
```

Inclua os tokens uma vez, no `angular.json` do produto:

```json
"styles": [
  "node_modules/@argila/ui/tokens/argila.css",
  "node_modules/@argila/ui/tokens/base.css",
  "src/styles.css"
]
```

`base.css` é opcional (fonte, cores e foco padrão do documento). A fonte Inter não vem
no pacote: carregue-a no produto ou troque `--arg-font-family`.

## Uso

```ts
import { ArgButton } from '@argila/ui';

@Component({
  imports: [ArgButton],
  template: `<button arg-button variant="primary" (click)="salvar()">Salvar</button>`,
})
export class Exemplo {}
```

## Tema

Modo de cor, no `<html>`: `data-arg-theme="light" | "dark" | "auto"`.

Marca do produto (fixa): sobrescreva tokens semânticos em CSS, sempre no `:root`.
Veja `tokens/themes/example-brand.css`.

Marca do tenant (vinda do banco, em tempo de execução):

```ts
const theme = inject(ArgTheme);
theme.setBrand({ primary: tenant.primaryColor, onPrimary: '#fff', radiusControl: '9999px' });
theme.setColorScheme('auto');
```

Hover, pressed e fundos suaves são derivados da cor principal automaticamente.
Garanta contraste de pelo menos 4.5:1 entre `primary` e `onPrimary`.
