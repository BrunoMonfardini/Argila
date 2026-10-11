# Utilitários internos

Comportamento compartilhado entre os componentes do Argila. **Não é API pública**: o `public-api.ts` não exporta nada daqui, e um produto não deve importar estes arquivos. Antes de escrever esse comportamento num componente, use o que já existe aqui.

## `injectUniqueId(prefixo)`: ids únicos

Para ligar elementos por atributo (`for`, `aria-describedby`, `aria-controls`, `aria-labelledby`). Chame num contexto de injeção, como um campo da classe:

```ts
protected readonly hintId = injectUniqueId('arg-field-hint'); // 'arg-field-hint-1'
```

O contador fica num serviço da aplicação: no SSR, servidor e navegador geram os mesmos ids.

## `RovingFocus`: navegação por setas

O padrão "roving tabindex" do [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex). O grupo inteiro é um único ponto de Tab; as setas, Home e End andam entre os itens. Para Tabs, Menu, grupo de Radio, Time Slot Picker, Combobox e Toolbar.

```ts
private readonly roving = new RovingFocus({
  items: () => this.tabs().map((tab) => tab.nativeElement),
  orientation: 'horizontal', // 'vertical' (padrão) | 'horizontal' | 'both'
  loop: true, // do último volta ao primeiro (padrão)
  typeahead: false, // true em menus e listas: digitar letras leva ao item
  onActiveChange: (index) => this.selected.set(index),
});

ngAfterViewInit() {
  this.roving.setActive(0); // tabindex 0 no ativo, -1 nos outros
}

// host: { '(keydown)': 'roving.handleKeydown($event)' }
```

- Itens com `disabled` ou `aria-disabled="true"` são pulados.
- Na horizontal, as setas se invertem quando a página está em `dir="rtl"`.
- `handleKeydown` devolve `true` e chama `preventDefault` quando usou a tecla, para a página não rolar.
- Quando o item muda por clique, chame `setActive(índice)` para manter o Tab no lugar certo.

## `ArgAnnouncer`: anúncio para leitor de tela

Anuncia sem mover o foco, por regiões `aria-live` escondidas no `<body>`. Para Toast, erro de Field, resultado de busca ("3 horários livres") e fim de carregamento.

```ts
private readonly announcer = inject(ArgAnnouncer);

this.announcer.announce('Agendamento salvo'); // polite: espera o leitor terminar
this.announcer.announce('Horário indisponível', 'assertive'); // só para erros que interrompem
```

A mesma mensagem duas vezes é anunciada duas vezes. Ao sair da tela que gerou as mensagens, `clear()` limpa as pendentes.

## `sr-only.css`: texto só para leitores de tela

Inclua o arquivo em `styleUrls` e use a classe `arg-sr-only` no elemento. Fica fora da tela visualmente, mas o leitor de tela lê:

```ts
styleUrls: ['./tag.css', '../internal/sr-only.css'],
```

```html
<span class="arg-sr-only">Remover</span>
```

## `placeBeside(gatilho, painel, lado, alinhamento)`: posição sem anchor CSS

Tooltip e Popover se posicionam por anchor CSS. Nos navegadores sem suporte (`supportsAnchor(window)` falso), chame `placeBeside` ao abrir: ele põe o painel (com `position: fixed`) ao lado do gatilho, troca para o lado oposto quando falta espaço e nunca deixa o painel sair da tela.

```ts
if (!supportsAnchor(this.document.defaultView)) {
  placeBeside(this.trigger, this.panel, 'bottom', 'start');
}
```
