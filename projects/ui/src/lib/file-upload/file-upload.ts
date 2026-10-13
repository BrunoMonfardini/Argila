import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArgButton } from '../button/button';
import { ArgIcon } from '../icon/icon';
import { ArgIconRegistry } from '../icon/icon-registry';
import { argIconCheck, argIconUpload, argIconX } from '../icon/icons.generated';
import { ArgIconButton } from '../icon-button/icon-button';
import { ArgAnnouncer } from '../internal/announcer';
import { injectUniqueId } from '../internal/unique-id';
import { ArgValueControlBase } from '../internal/value-control';
import { ArgProgressBar } from '../progress-bar/progress-bar';
import { fileProblem, formatSize } from './files';

export * from './files';

/**
 * Envia um arquivo (ex.: para o Supabase Storage) e avisa o progresso, de 0
 * a 100. Rejeite a promessa em caso de erro: o componente mostra "Tentar de novo".
 */
export type ArgFileUploader = (file: File, onProgress: (percent: number) => void) => Promise<void>;

type EntryStatus = 'invalid' | 'ready' | 'uploading' | 'done' | 'error';

interface Entry {
  id: number;
  file: File;
  size: string;
  extension: string;
  preview: string | null;
  status: EntryStatus;
  progress: number;
  error: string | null;
}

/**
 * Campo de arquivos sobre o `<input type="file">` nativo, com área para
 * arrastar e soltar, prévia de imagens, validação de tipo e tamanho e
 * progresso de envio.
 *
 * ```html
 * <arg-file-upload label="Fotos do pet" accept="image/*,.pdf" [maxSize]="5 * 1024 * 1024"
 *   multiple [uploader]="enviar" [formControl]="arquivos" />
 * ```
 *
 * O valor é a lista de arquivos aceitos (`File[]`). Com `uploader`, cada
 * arquivo aceito é enviado assim que entra, com barra de progresso.
 */
@Component({
  selector: 'arg-file-upload',
  imports: [ArgButton, ArgIcon, ArgIconButton, ArgProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css', '../internal/sr-only.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ArgFileUpload), multi: true },
  ],
  host: {
    class: 'arg-file-upload',
    '[class.arg-file-upload--dragging]': 'dragging()',
    '(dragenter)': 'onDragOver($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class ArgFileUpload extends ArgValueControlBase<File[]> {
  /** Título da área, que é o nome do campo: "Fotos do pet". */
  readonly label = input.required<string>();
  /** Regra em texto, lida junto com o campo: "JPG, PNG ou PDF, até 5 MB". */
  readonly hint = input<string>();
  /** Tipos aceitos, como no `accept` do `<input>`: "image/*,.pdf". */
  readonly accept = input('');
  /** Tamanho máximo de cada arquivo, em bytes. */
  readonly maxSize = input<number | null>(null);
  /** Aceita vários arquivos; sem isso, um novo substitui o anterior. */
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Envia cada arquivo aceito assim que entra, com progresso. Sem ele, os arquivos só ficam na lista. */
  readonly uploader = input<ArgFileUploader | null>(null);
  /** Arquivos aceitos. */
  readonly value = model<File[]>([]);

  protected readonly inputId = injectUniqueId('arg-file-upload');
  protected readonly titleId = injectUniqueId('arg-file-upload-title');
  protected readonly hintId = injectUniqueId('arg-file-upload-hint');
  protected readonly entries = signal<readonly Entry[]>([]);
  protected readonly dragging = signal(false);

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('file');
  private readonly announcer = inject(ArgAnnouncer);
  private nextId = 1;

  constructor() {
    super();
    inject(ArgIconRegistry).register([argIconUpload, argIconCheck, argIconX]);
    inject(DestroyRef).onDestroy(() => this.entries().forEach((entry) => this.revoke(entry)));
  }

  protected onPick(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.add(Array.from(input.files ?? []));
    // Permite escolher o mesmo arquivo de novo depois de removê-lo
    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    if (this.isDisabled()) return;
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !(event.currentTarget as HTMLElement).contains(next)) this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (this.isDisabled()) return;
    this.add(Array.from(event.dataTransfer?.files ?? []));
  }

  protected remove(entry: Entry): void {
    this.revoke(entry);
    this.entries.update((entries) => entries.filter((item) => item.id !== entry.id));
    this.sync();
    this.announcer.announce(`${entry.file.name} removido`);
    // O botão sumiu: o foco volta para o campo, sem se perder
    this.fileInput().nativeElement.focus();
  }

  protected retry(entry: Entry): void {
    this.upload(entry.id);
  }

  writeValue(files: File[] | null): void {
    this.entries().forEach((entry) => this.revoke(entry));
    this.entries.set((files ?? []).map((file) => this.entryFor(file, 'ready')));
    this.value.set(files ?? []);
  }

  private add(files: File[]): void {
    if (!files.length) return;
    const chosen = this.multiple() ? files : files.slice(0, 1);
    const rules = { accept: this.accept(), maxSize: this.maxSize() };
    const added = chosen.map((file) => {
      const problem = fileProblem(file, rules);
      const entry = this.entryFor(file, problem ? 'invalid' : 'ready');
      entry.error = problem;
      return entry;
    });
    if (!this.multiple()) this.entries().forEach((entry) => this.revoke(entry));
    this.entries.update((entries) => (this.multiple() ? [...entries, ...added] : added));
    this.sync();

    const accepted = added.filter((entry) => entry.status === 'ready');
    const refused = added.filter((entry) => entry.status === 'invalid');
    const messages = [
      accepted.length === 1
        ? `${accepted[0].file.name} adicionado.`
        : accepted.length
          ? `${accepted.length} arquivos adicionados.`
          : '',
      ...refused.map((entry) => `${entry.file.name} não foi adicionado: ${entry.error}`),
    ].filter(Boolean);
    this.announcer.announce(messages.join(' '), refused.length ? 'assertive' : 'polite');

    if (this.uploader()) accepted.forEach((entry) => this.upload(entry.id));
  }

  private upload(id: number): void {
    const uploader = this.uploader();
    const entry = this.entries().find((item) => item.id === id);
    if (!uploader || !entry) return;
    this.patch(id, { status: 'uploading', progress: 0, error: null });
    uploader(entry.file, (progress) =>
      this.patch(id, { progress: Math.min(Math.max(progress, 0), 100) }),
    ).then(
      () => {
        this.patch(id, { status: 'done', progress: 100 });
        this.announcer.announce(`${entry.file.name} enviado.`);
      },
      () => {
        this.patch(id, { status: 'error', error: 'Não foi possível enviar.' });
        this.announcer.announce(`${entry.file.name}: não foi possível enviar.`, 'assertive');
      },
    );
  }

  private patch(id: number, changes: Partial<Entry>): void {
    this.entries.update((entries) =>
      entries.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry)),
    );
  }

  /** O valor do formulário são os arquivos aceitos. */
  private sync(): void {
    const files = this.entries()
      .filter((entry) => entry.status !== 'invalid')
      .map((entry) => entry.file);
    this.value.set(files);
    this.notifyChange(files);
  }

  private entryFor(file: File, status: EntryStatus): Entry {
    const canPreview = file.type.startsWith('image/') && typeof URL.createObjectURL === 'function';
    return {
      id: this.nextId++,
      file,
      size: formatSize(file.size),
      extension: file.name.includes('.') ? file.name.split('.').pop()!.toUpperCase() : '',
      preview: status !== 'invalid' && canPreview ? URL.createObjectURL(file) : null,
      status,
      progress: 0,
      error: null,
    };
  }

  private revoke(entry: Entry): void {
    if (entry.preview) URL.revokeObjectURL(entry.preview);
  }
}
