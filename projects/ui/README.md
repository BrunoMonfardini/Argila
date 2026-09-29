# @brunomonfardini/ui

Componentes Angular acessíveis e temas por cliente via design tokens.

## Instalação

O pacote é privado, publicado no GitHub Packages. No produto, crie um `.npmrc` na raiz:

```ini
@brunomonfardini:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

- **Local:** exporte `NODE_AUTH_TOKEN` com um token do GitHub com permissão `read:packages`.
- **CI:** use `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` com `permissions: packages: read` no job, e dê ao repositório do produto acesso ao pacote (página do pacote → Package settings → Manage Actions access).

```sh
pnpm add @brunomonfardini/ui
```

Inclua os tokens uma vez, no `angular.json` do produto:

```json
"styles": [
  "node_modules/@brunomonfardini/ui/tokens/argila.css",
  "node_modules/@brunomonfardini/ui/tokens/base.css",
  "src/styles.css"
]
```

`base.css` é opcional (fonte, cores e foco padrão do documento). A fonte Inter não vem
no pacote: carregue-a no produto ou troque `--arg-font-family`.

## Uso

```ts
import { ArgButton } from '@brunomonfardini/ui';

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
