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

`base.css` é opcional (fonte, cores e foco padrão do documento). O Argila usa a fonte do
sistema operacional (`system-ui`): nada é baixado de fora. Para outra família, troque
`--arg-font-family` (ou use `ArgTheme.setBrand({ fontFamily })`).

## Uso

```ts
import { ArgButton } from '@brunomonfardini/ui';

@Component({
  imports: [ArgButton],
  template: `<button arg-button variant="primary" (click)="salvar()">Salvar</button>`,
})
export class Exemplo {}
```

### Componentes

| Componente         | Uso                                                                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Botão              | `<button arg-button variant="primary" [loading]="salvando()">Salvar</button>`                                                                                                                                                                                 |
| Botão de ícone     | `<button arg-icon-button icon="x" label="Fechar"></button>` (`label` obrigatório: vira o nome acessível)                                                                                                                                                      |
| Link               | `<a arg-link routerLink="/ajuda">Ajuda</a>`; em outra aba, `<a arg-link external href="…">`: ícone e aviso para leitor de tela                                                                                                                                |
| Divisor            | `<hr arg-divider />`; entre itens lado a lado, `<hr arg-divider orientation="vertical" decorative />`                                                                                                                                                         |
| Campo              | `<arg-field label="E-mail" hint="…" [error]="erro()"><input argFieldControl /></arg-field>`, importe `ARG_FIELD`                                                                                                                                              |
| Texto              | `<input arg-input [formControl]="nome" />`, `<textarea arg-textarea></textarea>`; dentro do `arg-field`, ligam-se sozinhos                                                                                                                                    |
| Lista de opções    | `<select arg-select [formControl]="servico"><option value="">Escolha</option>…</select>`                                                                                                                                                                      |
| Seleção            | `<select arg-select [formControl]="especie"><option value="gato">Gato</option></select>`, dentro do `arg-field`                                                                                                                                               |
| Escolhas           | `<label arg-choice><input type="checkbox" arg-checkbox /> Texto</label>`; também `arg-radio` e `arg-switch`; agrupe com `<arg-choice-group label="…">`; importe `ARG_CHOICE`                                                                                  |
| Spinner            | `<arg-spinner label="Carregando pedidos" />`                                                                                                                                                                                                                  |
| Skeleton           | `<arg-skeleton shape="text \| rect \| circle" width="60%" />` (sempre `aria-hidden`; `[animated]="false"` sem brilho)                                                                                                                                         |
| Lista              | `<ul arg-list divided bordered><li arg-list-item>…</li></ul>`, importe `ARG_LIST`                                                                                                                                                                             |
| Ícone              | `<arg-icon name="plus" />`; com significado sozinho, `<arg-icon name="alert-triangle" label="Atenção" />`                                                                                                                                                     |
| Badge              | `<span arg-badge tone="success">Confirmado</span>` (tons: neutral, primary, info, success, warning, danger)                                                                                                                                                   |
| Tag                | `<arg-tag removable (removed)="tirar(f)">{{ f }}</arg-tag>`: o botão se chama "Remover {texto}"; Delete e Backspace também removem                                                                                                                            |
| Avatar             | `<arg-avatar name="Maria Souza" [src]="foto()" />`: sem foto, ou se ela falhar, mostra as iniciais; `decorative` com o nome ao lado                                                                                                                           |
| Card               | `<article arg-card><h3 arg-card-title><a arg-card-link routerLink="…">Thor</a></h3>…<footer arg-card-actions>…</footer></article>`: com `arg-card-link` o card inteiro é clicável e os botões internos continuam funcionando; importe `ARG_CARD`              |
| Alerta             | `<div arg-alert tone="danger" heading="Não foi possível salvar">Tente de novo.</div>`: `role` pelo tom (status ou alert), ícone e nome do tom para leitor de tela; `dismissible` e `(dismissed)`; ações com `arg-alert-action`                                |
| Estado vazio       | `<section arg-empty-state heading="Nenhum pedido ainda" icon="plus" [level]="3">Texto. <button arg-button arg-empty-state-action>Novo pedido</button></section>`                                                                                              |
| Barra de progresso | `<progress arg-progress label="Enviando fotos" [value]="enviadas()" [max]="total"></progress>`; sem `value`, indeterminada (`label` obrigatório)                                                                                                              |
| Tooltip            | `<button arg-icon-button icon="x" label="Fechar" argTooltip="Fechar"></button>`; abre no foco e no hover, fecha com Esc; `argTooltipPosition="bottom"`                                                                                                        |
| Diálogo            | `inject(ArgDialog).open(EditarPet, { data })` devolve `ref.closed`; `await dialog.confirm({ title, message, tone: 'danger' })` devolve `true` ou `false`. No componente: `argDialogTitle`, `argDialogDescription`, `arg-dialog-content`, `arg-dialog-actions` |
| Gaveta             | `inject(ArgDrawer).open(Filtros, { data, side: 'end' })`: lateral no desktop, de baixo no celular; mesmas áreas e `ArgDialogRef` do diálogo                                                                                                                   |
| Popover            | `<button arg-button [argPopoverTrigger]="detalhes">Detalhes</button><arg-popover #detalhes label="Detalhes do pet">…</arg-popover>`; clique fora e Esc fecham; importe `ARG_POPOVER`                                                                          |
| Menu               | `<button arg-button [argMenuTrigger]="acoes">Ações</button><arg-menu #acoes><button arg-menu-item (click)="editar()">Editar</button></arg-menu>`; setas, Home/End, busca por letra e Esc; importe `ARG_MENU`                                                  |
| Toast              | `inject(ArgToast).show('Agendamento salvo', { tone: 'success' })`; com `action: { label: 'Desfazer', run }`; fila de 3, pausa no hover e no foco, anunciado pelo leitor de tela                                                                               |
| App Shell          | `<arg-app-shell brandName="Clínica Patas" [brandLogo]="logo"><nav arg-app-shell-nav aria-label="Principal">…</nav><router-outlet /></arg-app-shell>`; abaixo de 768 px o menu vira gaveta                                                                     |
| Abas               | `<arg-tabs label="Ficha do pet" [(selected)]="aba"><arg-tab label="Dados">…</arg-tab><arg-tab label="Vacinas">…</arg-tab></arg-tabs>`; setas, Home/End; importe `ARG_TABS`                                                                                    |

O `arg-icon-button` fica vazio no template (o nome vem do `label`). Se o produto usa o
`templateAccessibility` do angular-eslint, avise a regra de conteúdo:

```js
'@angular-eslint/template/elements-content': ['error', { allowList: ['arg-icon-button'] }],
```

Ícones: registre só os que o produto usa, no `app.config.ts`. Nome errado não compila.

```ts
import { argIconPlus, argIconX, provideArgIcons } from '@brunomonfardini/ui';

providers: [provideArgIcons([argIconPlus, argIconX])];
```

O ícone herda a cor do texto. Tamanho: `size="sm | md | lg"` (16, 20 e 24 px, pelos tokens
`--arg-icon-size-*`); sem `size`, acompanha o texto ao redor.

Item de lista, com áreas opcionais:

```html
<ul arg-list divided>
  <li arg-list-item>
    <img arg-list-leading src="avatar.png" alt="" />
    <span arg-list-title>Maria Souza</span>
    <span arg-list-description>maria@exemplo.com</span>
    <span arg-list-trailing>Admin</span>
  </li>
  <li arg-list-item>
    <a arg-list-action routerLink="/pedidos/42"><span arg-list-title>Pedido #42</span></a>
  </li>
</ul>
```

Exemplos vivos, playground e padrões combinados (carregamento, vazio) no catálogo: `npm run dev`.

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

### Carregamento

Skeleton e spinner seguem os tokens `--arg-loading-*`. Para mudar o shimmer do produto inteiro:

```css
:root {
  --arg-loading-shimmer-duration: 2s;
  --arg-loading-highlight: color-mix(in oklab, var(--arg-color-primary) 20%, transparent);
}
```

Para desligar o brilho de um skeleton específico: `<arg-skeleton [animated]="false" />`. Com "reduzir movimento" ativo no sistema, todos ficam estáticos.
