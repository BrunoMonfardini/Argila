import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ArgFileUpload, ArgFileUploader } from '../file-upload';

/**
 * Envio de exemplo: o progresso avança em 1 segundo. Um arquivo com "erro"
 * no nome falha, para mostrar o "Tentar de novo". Num produto, o uploader
 * envia ao Supabase Storage.
 */
const simulatedUpload: ArgFileUploader = (file, onProgress) =>
  new Promise((resolve, reject) => {
    let progress = 0;
    const timer = setInterval(() => {
      progress += 25;
      onProgress(progress);
      if (progress < 100) return;
      clearInterval(timer);
      if (file.name.toLowerCase().includes('erro')) reject(new Error('falhou'));
      else resolve();
    }, 250);
  });

/** Arraste fotos ou PDFs, ou use o teclado: Tab até a área e Enter. */
@Component({
  selector: 'doc-file-upload-pet-example',
  imports: [ArgFileUpload, ReactiveFormsModule],
  template: `
    <div class="doc-stack">
      <arg-file-upload
        label="Fotos e exames do pet"
        hint="Imagens ou PDF, até 5 MB cada."
        accept="image/*,.pdf"
        [maxSize]="5 * 1024 * 1024"
        multiple
        [uploader]="upload"
        [formControl]="files"
      />
      <p class="doc-said">
        No formulário: {{ count() }} {{ count() === 1 ? 'arquivo' : 'arquivos' }}
      </p>
    </div>
  `,
  styles: `
    .doc-stack {
      display: grid;
      flex: 1 1 100%;
      gap: var(--arg-space-3);
      max-width: 32rem;
    }
    .doc-said {
      margin: 0;
      color: var(--arg-color-text-muted);
    }
  `,
})
export class FileUploadPetExample {
  protected readonly upload = simulatedUpload;
  protected readonly files = new FormControl<File[]>([], { nonNullable: true });
  private readonly value = toSignal(this.files.valueChanges, { initialValue: [] as File[] });
  protected count(): number {
    return this.value().length;
  }
}
