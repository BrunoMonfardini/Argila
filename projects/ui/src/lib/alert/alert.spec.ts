import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArgIcon } from '../icon/icon';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAlert, ArgAlertLive, ArgAlertTone } from './alert';

@Component({
  imports: [ArgAlert],
  template: `
    <div
      arg-alert
      [tone]="tone()"
      [live]="live()"
      [heading]="heading()"
      [dismissible]="dismissible()"
      (dismissed)="dismissed = dismissed + 1"
    >
      Confira a conexão.
      <button arg-alert-action type="button">Tentar de novo</button>
    </div>
  `,
})
class Host {
  readonly tone = signal<ArgAlertTone>('info');
  readonly live = signal<ArgAlertLive | undefined>(undefined);
  readonly heading = signal<string | undefined>(undefined);
  readonly dismissible = signal(false);
  dismissed = 0;
}

describe('ArgAlert', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const alert = root.querySelector<HTMLElement>('[arg-alert]')!;
    const set = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    const iconName = () =>
      fixture.debugElement.query(By.directive(ArgIcon)).componentInstance.name() as string;
    return { fixture, host: fixture.componentInstance, root, alert, set, iconName };
  }

  const text = (el: Element) => el.textContent?.replace(/\s+/g, ' ').trim();

  it.each([
    ['info', 'status', 'info', 'Informação'],
    ['success', 'status', 'check-circle', 'Sucesso'],
    ['warning', 'alert', 'alert-triangle', 'Atenção'],
    ['danger', 'alert', 'alert-circle', 'Erro'],
  ] as const)('tom %s: role %s, ícone %s e nome "%s"', async (tone, role, icon, label) => {
    const { alert, set, iconName } = await setup();
    await set((host) => host.tone.set(tone));

    expect(alert.classList).toContain(`arg-alert--${tone}`);
    expect(alert.getAttribute('role')).toBe(role);
    expect(iconName()).toBe(icon);
    expect(text(alert)).toMatch(new RegExp(`^${label}: Confira a conexão\\.`));
  });

  it('o ícone é decorativo', async () => {
    const { alert } = await setup();
    expect(alert.querySelector('arg-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('live troca o role padrão do tom; off tira o role', async () => {
    const { alert, set } = await setup();

    await set((host) => host.live.set('assertive'));
    expect(alert.getAttribute('role')).toBe('alert');

    await set((host) => host.live.set('off'));
    expect(alert.hasAttribute('role')).toBe(false);
  });

  it('com título, o nome do tom vem antes do título', async () => {
    const { alert, set } = await setup();
    await set((host) => {
      host.tone.set('danger');
      host.heading.set('Não foi possível salvar');
    });

    expect(alert.querySelector('.arg-alert__heading')?.textContent?.trim()).toBe(
      'Não foi possível salvar',
    );
    expect(text(alert)).toMatch(/^Erro: Não foi possível salvar Confira a conexão\./);
  });

  it('projeta as ações no rodapé do alerta', async () => {
    const { alert } = await setup();
    const action = alert.querySelector('.arg-alert__actions button');
    expect(action?.textContent).toBe('Tentar de novo');
  });

  it('botão de fechar com nome, que emite dismissed', async () => {
    const { host, alert, set } = await setup();
    expect(alert.querySelector('.arg-alert__dismiss')).toBeNull();

    await set((h) => h.dismissible.set(true));
    const close = alert.querySelector<HTMLButtonElement>('.arg-alert__dismiss')!;
    expect(accessibleName(close)).toBe('Fechar aviso');

    close.click();
    expect(host.dismissed).toBe(1);
  });

  it('não tem violações de acessibilidade', async () => {
    const { root, set } = await setup();
    await set((host) => {
      host.heading.set('Horário especial');
      host.dismissible.set(true);
    });
    expect(a11yViolations(root)).toEqual([]);
  });
});
