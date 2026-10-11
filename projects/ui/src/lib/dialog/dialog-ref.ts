import { InjectionToken, Injector } from '@angular/core';

export type ArgDialogSize = 'sm' | 'md' | 'lg';

export interface ArgDialogConfig<D = unknown> {
  /** Dados para o componente do diálogo, lidos com `inject(ARG_DIALOG_DATA)`. */
  data?: D;
  /** Largura máxima: `sm` (24rem), `md` (32rem, padrão) ou `lg` (48rem). */
  size?: ArgDialogSize;
  /**
   * Nome do diálogo, quando ele não tem um título com `argDialogTitle`.
   * Com título, o nome vem dele.
   */
  label?: string;
  /** `false` impede fechar com Esc ou clicando fora: só um botão do diálogo fecha. */
  dismissable?: boolean;
  /** `alertdialog` para confirmações que interrompem a tarefa. */
  role?: 'dialog' | 'alertdialog';
  /** Injector pai do componente, para ele usar serviços de quem abriu. */
  injector?: Injector;
}

/** Dados passados em `ArgDialog.open(..., { data })`. */
export const ARG_DIALOG_DATA = new InjectionToken<unknown>('ARG_DIALOG_DATA');

/**
 * Referência a um diálogo aberto. O componente do diálogo a recebe com
 * `inject(ArgDialogRef)` para fechar; quem abriu espera o resultado em `closed`.
 */
export class ArgDialogRef<R = unknown> {
  /** Resultado de `close()`; `undefined` quando fecha por Esc ou clique fora. */
  readonly closed: Promise<R | undefined>;
  /** Id do título (`argDialogTitle`), que dá nome ao diálogo. */
  readonly titleId: string;
  /** Id da descrição (`argDialogDescription`), lida ao abrir. */
  readonly descriptionId: string;

  private resolve!: (result: R | undefined) => void;

  constructor(
    id: string,
    private readonly requestClose: (ref: ArgDialogRef<R>, result: R | undefined) => void,
  ) {
    this.titleId = `${id}-title`;
    this.descriptionId = `${id}-description`;
    this.closed = new Promise((resolve) => (this.resolve = resolve));
  }

  /** Fecha o diálogo, devolve o foco a quem abriu e entrega `result` a `closed`. */
  close(result?: R): void {
    this.requestClose(this, result);
  }

  /** @internal Chamado pelo serviço depois de fechar. */
  settle(result: R | undefined): void {
    this.resolve(result);
  }
}
