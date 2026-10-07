import { ChangeDetectionStrategy, Component, OnInit, input, signal } from '@angular/core';
import { ArgButton } from '../../lib/button/button';
import { ARG_LIST } from '../../lib/list/list';
import { ArgSkeleton } from '../../lib/skeleton/skeleton';
import { ArgSpinner } from '../../lib/spinner/spinner';

interface Order {
  id: number;
  customer: string;
  items: number;
  total: string;
}

const ORDERS: Order[] = [
  { id: 1042, customer: 'Maria Souza', items: 3, total: 'R$ 289,90' },
  { id: 1041, customer: 'João Pereira', items: 1, total: 'R$ 59,00' },
  { id: 1040, customer: 'Ana Lima', items: 2, total: 'R$ 132,40' },
];

/**
 * Lista que carrega dados: skeleton no primeiro carregamento (o usuário vê a
 * forma do que vem), spinner no botão ao recarregar (o conteúdo atual fica).
 */
@Component({
  selector: 'doc-list-loading-example',
  imports: [ArgButton, ArgSkeleton, ArgSpinner, ARG_LIST],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section style="width: 100%; max-width: 28rem; display: grid; gap: var(--arg-space-3)">
      <header style="display: flex; align-items: center; justify-content: space-between">
        <h4 style="margin: 0; font-size: var(--arg-font-size-heading-sm)">Pedidos</h4>
        <button
          arg-button
          variant="secondary"
          size="sm"
          [loading]="refreshing()"
          (click)="refresh()"
        >
          Recarregar
        </button>
      </header>

      @switch (state()) {
        @case ('loading') {
          <ul arg-list divided bordered aria-busy="true" aria-label="Carregando pedidos">
            @for (row of skeletonRows; track row) {
              <li arg-list-item aria-hidden="true">
                <span arg-list-leading><arg-skeleton shape="circle" /></span>
                <arg-skeleton [width]="row" />
                <arg-skeleton width="40%" />
                <span arg-list-trailing><arg-skeleton width="4rem" /></span>
              </li>
            }
          </ul>
        }
        @case ('empty') {
          <p
            style="margin: 0; padding: var(--arg-space-8); text-align: center;
            color: var(--arg-color-text-muted); border: 1px dashed var(--arg-color-border);
            border-radius: var(--arg-radius-container)"
          >
            Nenhum pedido por aqui ainda.
          </p>
        }
        @default {
          <ul arg-list divided bordered [attr.aria-busy]="refreshing() || null">
            @for (order of orders; track order.id) {
              <li arg-list-item>
                <a arg-list-action [href]="'#pedido-' + order.id">
                  <span arg-list-title>Pedido #{{ order.id }}</span>
                  <span arg-list-description>
                    {{ order.items }} {{ order.items === 1 ? 'item' : 'itens' }} ·
                    {{ order.customer }}
                  </span>
                  <span arg-list-trailing>{{ order.total }} ›</span>
                </a>
              </li>
            }
          </ul>
        }
      }

      @if (state() === 'loading') {
        <p
          style="display: flex; gap: var(--arg-space-2); align-items: center; margin: 0;
          color: var(--arg-color-text-muted); font-size: var(--arg-font-size-body-sm)"
        >
          <arg-spinner size="sm" decorative style="--arg-spinner-color: currentColor" />
          Buscando pedidos…
        </p>
      }
    </section>
  `,
})
export class ListLoadingExample implements OnInit {
  readonly delay = input(1500);
  readonly startEmpty = input(false);
  /** Mantém o primeiro carregamento para inspecionar o skeleton. */
  readonly hold = input(false);

  protected readonly orders = ORDERS;
  protected readonly skeletonRows = ['70%', '55%', '65%'];
  protected readonly state = signal<'loading' | 'ready' | 'empty'>('loading');
  protected readonly refreshing = signal(false);

  ngOnInit(): void {
    if (this.hold()) return;
    setTimeout(() => this.state.set(this.startEmpty() ? 'empty' : 'ready'), this.delay());
  }

  protected refresh(): void {
    if (this.state() === 'loading') return;
    this.refreshing.set(true);
    setTimeout(() => this.refreshing.set(false), this.delay());
  }
}

/** A busca volta sem resultados: estado vazio no lugar da lista. */
@Component({
  selector: 'doc-list-loading-empty-example',
  imports: [ListLoadingExample],
  template: '<doc-list-loading-example [startEmpty]="true" />',
})
export class ListLoadingEmptyExample {}

/** Fica em skeleton, para inspecionar o layout do placeholder. */
@Component({
  selector: 'doc-list-loading-held-example',
  imports: [ListLoadingExample],
  template: '<doc-list-loading-example [hold]="true" />',
})
export class ListLoadingHeldExample {}
