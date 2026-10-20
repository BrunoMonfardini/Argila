# Ícones do Argila

**Todos os ícones são desenhados pelo time.** Nenhum é copiado ou adaptado de conjuntos de terceiros, mesmo os de licença aberta. Eles aparecem em **Fundação → Ícones** no catálogo.

## Padrão de desenho

| Regra         | Valor                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Grade         | 24×24 px (`viewBox="0 0 24 24"`), com 2 px de margem de segurança (área útil de 20×20)         |
| Traço         | 2 px, pontas e junções arredondadas (`stroke-linecap` e `stroke-linejoin` `round`)             |
| Preenchimento | Nenhum (`fill="none"`): a forma vem só do traço                                                |
| Cor           | `stroke="currentColor"`: o ícone herda a cor do texto ao redor                                 |
| Elementos     | Só `<path>`, `<circle>`, `<rect>` e `<line>`, sem `<g>`, `transform` ou `style`                |
| Nome          | Em kebab-case, pela **forma**, não pelo uso: `trash` (não `delete`), `arrow-left` (não `back`) |

O nome pela forma importa porque o mesmo desenho serve em contextos diferentes: a lixeira é "excluir" numa tabela e "esvaziar" num carrinho.

## Ícone novo

1. Desenhe no padrão e salve o SVG nesta pasta (`<nome>.svg`).
2. Rode `npm run icons`: o gerador valida o arquivo, tira o que não é desenho (metadados do editor, `id`, `class`) e atualiza `src/lib/icon/icons.generated.ts`. Se o SVG fugir do padrão, ele explica o porquê.
3. Abra o PR com o SVG e o arquivo gerado. O CI roda `npm run icons:check`.

## Do SVG ao código

Cada ícone vira uma **constante TypeScript**, e o produto registra só os que usa:

```text
projects/ui/icons/plus.svg               → desenhado pelo time
        ↓  npm run icons
projects/ui/src/lib/icon/icons.generated.ts
        export const argIconPlus: ArgIconDef = { name: 'plus', svg: '<path d="M12 5v14M5 12h14"/>' };
        export type ArgIconName = 'plus' | 'trash' | 'calendar' | …;
```

```ts
// app.config.ts do produto
providers: [provideArgIcons([argIconPlus, argIconTrash, argIconCalendar])];
```

Por que constantes e não um sprite: o produto leva só os ícones registrados, não precisa copiar arquivos para os assets, nome errado é erro de compilação e funciona sem rede.

## Regras de uso

- **Tamanho por token:** `--arg-icon-size-sm` (16 px), `--arg-icon-size-md` (20 px) e `--arg-icon-size-lg` (24 px). Sem tamanho, o ícone acompanha o texto ao redor (`1.25em`).
- **Cor:** sempre herdada (`currentColor`). Nunca se define cor no ícone.
- **Acessibilidade:**
  - ícone ao lado de texto é decorativo e fica oculto para leitores de tela (o padrão);
  - ícone com significado sozinho recebe `label`: `<arg-icon name="alert-triangle" label="Atenção" />`;
  - botão só com ícone usa o **Icon Button**, que exige `label`; sem ele, não compila.
- **Dentro dos componentes:** `<button arg-button><arg-icon name="plus" /> Novo agendamento</button>`. Os componentes internos (Select, Date Picker, Alert) usam os mesmos ícones, nunca SVG solto no código.
