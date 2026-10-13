import { TestBed } from '@angular/core/testing';
import { StepperBookingExample } from '../../../ui/src/lib/stepper/examples/stepper-booking.example';

/** O exemplo do Stepper avança, volta e deixa voltar pelas etapas feitas. */
describe('exemplo do Stepper', () => {
  it('Avançar, Voltar e as etapas feitas mudam a etapa atual', async () => {
    const fixture = TestBed.createComponent(StepperBookingExample);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const current = () => root.querySelector('[aria-current="step"]')?.textContent?.trim();
    const button = (text: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((b) =>
        b.textContent?.trim().startsWith(text),
      )!;
    const click = async (text: string) => {
      button(text).click();
      await fixture.whenStable();
    };

    expect(current()).toContain('Horário');
    await click('Avançar');
    expect(current()).toContain('Confirmação');
    expect(button('Avançar').disabled).toBe(true);

    await click('Voltar');
    expect(current()).toContain('Horário');

    // Etapa feita vira botão: volta direto para "Serviço"
    await click('Serviço');
    expect(current()).toContain('Serviço');
    expect(button('Voltar').disabled).toBe(true);
  });
});
