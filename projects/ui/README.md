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
| Trilha             | `<nav arg-breadcrumb><li arg-breadcrumb-item><a arg-link variant="muted" routerLink="/clientes">Clientes</a></li><li arg-breadcrumb-item current>Thor</li></nav>`; importe `ARG_BREADCRUMB`                                                                   |
| Paginação          | `<nav arg-pagination [total]="paginas()" [(page)]="pagina"></nav>`; anterior, próxima, números com reticências e "Página 3 de 12" anunciado                                                                                                                   |
| Etapas             | `<arg-stepper [steps]="['Serviço', 'Horário', 'Pagamento']" [current]="1" />`; feita, atual e pendente pela forma e pelo texto; `navigable` para voltar                                                                                                       |
| Valor em R$        | `<input arg-currency [formControl]="preco" />`: dígitos entram pela direita; o formulário recebe centavos (inteiro); `formatCents(8990)` → "R$ 89,90"                                                                                                         |
| Máscara            | `<input arg-mask="cpf" [formControl]="cpf" />` (também `cnpj`, alfanumérico, `cep` e `phone`): o formulário recebe só os dígitos; Reactive Forms já valida os dígitos verificadores; `isValidCpf`… para signals                                               |
| Data               | `<input arg-date [formControl]="data" [min]="hoje" [blocked]="domingo" />`: digitação em dd/mm/aaaa ou calendário por teclado; o formulário recebe ISO                                                                                                        |
| Horários           | `<fieldset arg-time-slots label="Horário" [slots]="horarios()" [loading]="carregando()" [formControl]="horario"></fieldset>`: livres e ocupados, setas, carregando                                                                                            |
| Arquivos           | `<arg-file-upload label="Fotos" accept="image/*,.pdf" [maxSize]="5 * 1024 * 1024" multiple [uploader]="enviar" [formControl]="arquivos" />`: arrastar e soltar, prévia, recusa com motivo e progresso                                                         |
| Sugestões          | `<input arg-combobox [options]="servicos" [formControl]="servico" />` ou `[search]="buscarTutores"`: padrão combobox do APG, carregando e vazio                                                                                                               |
| Tabela             | `<arg-table caption="Pets" [columns]="colunas" [rows]="pets()" rowKey="id" selectable [(selected)]="ids" [(sort)]="ordem" [loading]="carregando()" />`; importe `ARG_TABLE`                                                                                   |
| Agenda             | `<arg-agenda [events]="agendamentos()" [(date)]="dia" [(view)]="visao" start="08:00" end="19:00" (eventSelect)="abrir($event)" (slotSelect)="novo($event)" />`: dia e semana, simultâneos lado a lado, teclado completo                                       |

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

A aparência vem de um **design system** (DS) e de uma **paleta** aceita por ele, também no `<html>`:

| Eixo          | Atributo           | Define                             | Valores                                                                                       |
| ------------- | ------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| Design system | `data-arg-style`   | forma: raio, borda, sombra, fonte  | `argila` (padrão), `molde`, `coda`, `transparente`, `windows-xp`                              |
| Paleta        | `data-arg-palette` | cores, só entre as que o DS aceita | `nativa` (a do DS, padrão), `terrosa`, `oceano`, `floresta`, `mono`, `alto-contraste`, `viva` |

O Argila, o padrão, tem forma "de massinha" (pílulas, volume, campos rebaixados) e vem no
próprio `argila.css`; para o visual plano de antes, use `data-arg-style="molde"`.

Cada DS tem um manifesto (`ARG_DESIGN_SYSTEMS`) com os modos de cor, as paletas que aceita
e se aceita transparência. O CSS de cada um fica em `tokens/design-systems/<ds>/`: `forma.css`,
`paletas/nativa.css`, a pele dos componentes curados em `componentes/` e um `index.css` que
junta tudo.

A paleta padrão do Argila é a **Massinha** (menta sobre superfícies quase brancas): são os
próprios tokens semânticos, então vale mesmo sem `temas.css`. As paletas compartilhadas
(`ARG_SHARED_PALETTES`) ficam em `tokens/palettes/` e chegam com o `temas.css`. Para manter o
visual café de antes da 0.6, use `data-arg-palette="terrosa"`.

Importe `tokens/temas.css` depois de `tokens/argila.css` (ou só a forma e a paleta do DS que o
produto usa). Sem `data-arg-palette`, cada DS usa a própria paleta. Os caminhos antigos
`tokens/styles/<ds>.css` e `tokens/palettes/nativas/<ds>.css` continuam funcionando e serão
removidos numa versão major. O atributo antigo `data-arg-brand` continua funcionando para
`example` (Molde), `coda`, `transparente` e `windows-xp`.

```html
<html data-arg-style="coda" data-arg-palette="terrosa" data-arg-theme="dark"></html>
```

Pelo Angular, com o `ArgTheme`:

```ts
const theme = inject(ArgTheme);
theme.setStyle('windows-xp');
theme.setPalette('terrosa');
theme.setSurfaceOpacity(0.7); // superfícies translúcidas, de 0.4 a 1
```

O `ArgTheme` respeita o manifesto do DS atual: `theme.schemes()`, `theme.palettes()` e
`theme.acceptsTransparency()` dizem o que vale agora. Ao trocar de DS, o que ele não aceita
volta ao padrão dele, com aviso no console em modo de desenvolvimento: um modo de cor não
suportado, uma paleta não aceita e a transparência (CODA e Windows XP não aceitam).
`setPalette()` com uma paleta não aceita usa a padrão, e `setSurfaceOpacity()` num DS sem
transparência é ignorado.

Superfícies translúcidas: `--arg-surface-opacity` (padrão 1; 0.6 no Transparente). Paletas e
temas sobrescrevem as cores opacas `--arg-color-surface-solid`, `-raised-solid` e
`-sunken-solid`; os componentes usam `--arg-color-surface`, já com a transparência.

Marca do produto (fixa): crie um DS próprio a partir do Molde. Copie a pasta
`tokens/design-systems/molde/` (forma e paleta, sempre no `:root`).

Cores de marca da lista fixa (`ARG_BRAND_COLORS`: cobre, caramelo, terracota, petróleo, anil,
menta…), só entre as que passam no contraste no design system e na paleta atuais:

```ts
theme.setColors({ primary: 'cobre', accent: 'mostarda' });
theme.allowedColors(); // { primary: [...], secondary: [...], accent: [...] }
```

Sem Angular: `data-arg-primary="cobre"` (e `-secondary`, `-accent`) no `<html>`, com o `temas.css`
importado. Uma cor fora da lista do par é ignorada pelo `ArgTheme`, com aviso.

Marca do tenant com cor livre (vinda do banco, em tempo de execução; o contraste fica por conta
do produto):

```ts
const theme = inject(ArgTheme);
theme.setBrand({ primary: tenant.primaryColor, onPrimary: '#fff', radiusControl: '9999px' });
theme.setColorScheme('auto');
```

`setBrand()` também aceita `secondary`, `accent` (com `onSecondary` e `onAccent`) e
`fontFamilyHeading`. Hover, pressed e fundos suaves são derivados de cada cor automaticamente.
Garanta contraste de pelo menos 4.5:1 entre cada cor e o texto por cima.

### Carregamento

Skeleton e spinner seguem os tokens `--arg-loading-*`. Para mudar o shimmer do produto inteiro:

```css
:root {
  --arg-loading-shimmer-duration: 2s;
  --arg-loading-highlight: color-mix(in oklab, var(--arg-color-primary) 20%, transparent);
}
```

Para desligar o brilho de um skeleton específico: `<arg-skeleton [animated]="false" />`. Com "reduzir movimento" ativo no sistema, todos ficam estáticos.
