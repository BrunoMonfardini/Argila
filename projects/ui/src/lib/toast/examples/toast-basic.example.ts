import { Component, inject, signal } from '@angular/core';
import { ArgButton } from '../../button/button';
import { ArgToast } from '../toast';

/** Clique várias vezes: até 3 ficam na tela e os outros esperam a vez. Passe o mouse para pausar. */
@Component({
  selector: 'doc-toast-basic-example',
  imports: [ArgButton],
  template: `
    <button arg-button variant="secondary" (click)="saved()">Salvar agendamento</button>
    <button arg-button variant="secondary" (click)="removed()">Remover pet</button>
    <button arg-button variant="secondary" (click)="failed()">Simular erro</button>
    <p class="doc-said">{{ said() }}</p>
  `,
  styles: `
    .doc-said {
      flex: 1 1 100%;
      min-height: 1.5em;
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class ToastBasicExample {
  private readonly toast = inject(ArgToast);
  protected readonly said = signal('');
  private count = 0;

  protected saved(): void {
    this.count++;
    this.toast.show(`Agendamento ${this.count} salvo.`, { tone: 'success' });
  }

  protected async removed(): Promise<void> {
    const ref = this.toast.show('Mel foi removida da lista.', {
      action: { label: 'Desfazer', run: () => this.said.set('Mel voltou para a lista.') },
    });
    const reason = await ref.dismissed;
    if (reason !== 'action') this.said.set('Remoção confirmada.');
  }

  protected failed(): void {
    this.toast.show('Confira a conexão e tente de novo.', {
      tone: 'danger',
      title: 'Não foi possível salvar',
      duration: 0,
    });
  }
}
