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
