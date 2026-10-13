import { TestBed } from '@angular/core/testing';
import { FileUploadPetExample } from '../../../ui/src/lib/file-upload/examples/file-upload-pet.example';

/** O exemplo do File Upload envia (simulado), mostra o erro e conta os arquivos. */
describe('exemplo do File Upload', () => {
  afterEach(() => vi.useRealTimers());

  it('envia, falha o arquivo "erro" e conta os arquivos do formulário', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(FileUploadPetExample);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    const files = [
      new File(['a'], 'thor.jpg', { type: 'image/jpeg' }),
      new File(['b'], 'erro.pdf', { type: 'application/pdf' }),
    ];
    Object.defineProperty(input, 'files', { value: files });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(root.querySelectorAll('progress')).toHaveLength(2);

    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();
    const items = Array.from(root.querySelectorAll('.arg-file-upload__item'));
    expect(items[0].textContent).toContain('Enviado');
    expect(items[1].textContent).toContain('Não foi possível enviar.');
    expect(root.querySelector('.doc-said')?.textContent?.trim()).toBe('No formulário: 2 arquivos');
  });
});
