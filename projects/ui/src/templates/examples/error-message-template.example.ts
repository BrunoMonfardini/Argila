import { Component, signal } from '@angular/core';
import { ArgAlert } from '../../lib/alert/alert';
import { ArgButton } from '../../lib/button/button';
import { ArgEmptyState } from '../../lib/empty-state/empty-state';
import { ArgLink } from '../../lib/link/link';

/** Erro de carregamento: diz o que falhou e oferece tentar de novo, sem perder a tela. */
@Component({
  selector: 'doc-template-error-loading',
  imports: [ArgAlert, ArgButton],
  template: `
    @if (failed()) {
      <div arg-alert tone="danger" heading="Não foi possível carregar os pedidos">
        A conexão com o servidor caiu no meio do caminho.
        <button arg-button arg-alert-action size="sm" [loading]="retrying()" (click)="retry()">
          Tentar de novo
        </button>
      </div>
    } @else {
      <p role="status">Pedidos carregados.</p>
    }
  `,
})
export class ErrorLoadingTemplate {
  protected readonly failed = signal(true);
  protected readonly retrying = signal(false);

  protected retry(): void {
    this.retrying.set(true);
    setTimeout(() => {
      this.retrying.set(false);
      this.failed.set(false);
    }, 600);
  }
}

/** Sem conexão: a tela inteira, porque nada funciona sem rede. */
@Component({
  selector: 'doc-template-error-offline',
  imports: [ArgButton, ArgEmptyState],
  template: `
    <section arg-empty-state heading="Sem conexão" icon="alert-triangle" [level]="3" bordered>
      Confira o Wi-Fi ou os dados móveis. O que você já preencheu continua salvo aqui.
      <button arg-button arg-empty-state-action>Tentar de novo</button>
    </section>
  `,
})
export class ErrorOfflineTemplate {}

/** Sem permissão: explica por quê e quem pode liberar. */
@Component({
  selector: 'doc-template-error-permission',
  imports: [ArgEmptyState, ArgLink],
  template: `
    <section
      arg-empty-state
      heading="Você não tem acesso ao financeiro"
      icon="lock"
      [level]="3"
      bordered
    >
      Só administradores da clínica veem esta área.
      <a arg-link arg-empty-state-action href="#" (click)="$event.preventDefault()"
        >Pedir acesso a um administrador</a
      >
    </section>
  `,
})
export class ErrorPermissionTemplate {}
