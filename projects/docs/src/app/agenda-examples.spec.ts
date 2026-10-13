import { TestBed } from '@angular/core/testing';
import { AgendaClinicExample } from '../../../ui/src/lib/agenda/examples/agenda-clinic.example';

/** O exemplo da Agenda abre agendamentos e começa novos nos horários livres. */
describe('exemplo da Agenda', () => {
  it('clicar num agendamento o abre; num horário livre, começa um novo', async () => {
    const fixture = TestBed.createComponent(AgendaClinicExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const said = () => root.querySelector('.doc-said')?.textContent?.trim();

    root.querySelector<HTMLElement>('[data-event-id="1"]')!.click();
    await fixture.whenStable();
    expect(said()).toBe('Abrir: Banho (Thor)');

    const free = Array.from(root.querySelectorAll<HTMLElement>('[role="gridcell"]')).find((c) =>
      c.getAttribute('aria-label')?.endsWith('livre'),
    )!;
    free.click();
    await fixture.whenStable();
    const [day, slot] = free.dataset['cell']!.split('|');
    expect(said()).toBe(
      `Novo agendamento em ${day} às ${root.querySelectorAll('[role="rowheader"]')[+slot].textContent}`,
    );
  });
});
