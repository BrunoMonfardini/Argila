import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { a11yViolations, accessibleName } from '../../testing/a11y';
import { ArgAnnouncer } from '../internal/announcer';
import { ArgFileUpload, ArgFileUploader } from './file-upload';

const MB = 1024 * 1024;
const file = (name: string, type: string, size = 1024) =>
  new File([new Uint8Array(size)], name, { type });

@Component({
  imports: [ArgFileUpload, ReactiveFormsModule],
  template: `
    <arg-file-upload
      label="Fotos do pet"
      hint="Imagens ou PDF, até 1 MB."
      accept="image/*,.pdf"
      [maxSize]="maxSize"
      [multiple]="multiple()"
      [uploader]="uploader()"
      [formControl]="files"
    />
  `,
})
class Host {
  readonly maxSize = 1 * MB;
  readonly multiple = signal(true);
  readonly uploader = signal<ArgFileUploader | null>(null);
  readonly files = new FormControl<File[]>([], { nonNullable: true });
}

/** Envio controlado pelo teste: avisa progresso e termina quando mandado. */
function controlledUploader() {
  const calls: {
    file: File;
    progress: (p: number) => void;
    resolve: () => void;
    reject: () => void;
  }[] = [];
  const uploader: ArgFileUploader = (f, progress) =>
    new Promise<void>((resolve, reject) => calls.push({ file: f, progress, resolve, reject }));
  return { uploader, calls };
}

describe('ArgFileUpload', () => {
  async function setup() {
    const announce = vi
      .spyOn(TestBed.inject(ArgAnnouncer), 'announce')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    const host = root.querySelector<HTMLElement>('arg-file-upload')!;
    const stable = () => fixture.whenStable();
    const pick = async (...files: File[]) => {
      Object.defineProperty(input, 'files', { value: files, configurable: true });
      input.dispatchEvent(new Event('change'));
      await stable();
    };
    const items = () => Array.from(root.querySelectorAll<HTMLLIElement>('.arg-file-upload__item'));
    const text = (el: Element) => el.textContent?.replace(/\s+/g, ' ').trim();
    return {
      fixture,
      host: fixture.componentInstance,
      root,
      input,
      el: host,
      stable,
      pick,
      items,
      text,
      announce,
    };
  }

  afterEach(() => vi.restoreAllMocks());

  it('o input nativo tem o título como nome e a dica como descrição', async () => {
    const { input, root } = await setup();
    expect(input.type).toBe('file');
    expect(input.accept).toBe('image/*,.pdf');
    expect(input.multiple).toBe(true);
    expect(accessibleName(input)).toBe('Fotos do pet');
    expect(root.querySelector(`#${input.getAttribute('aria-describedby')}`)?.textContent).toBe(
      'Imagens ou PDF, até 1 MB.',
    );
    expect(root.querySelector('label')?.getAttribute('for')).toBe(input.id);
  });

  it('aceita os arquivos válidos e recusa por tipo e por tamanho, com o motivo', async () => {
    const { host, pick, items, text, announce } = await setup();
    const photo = file('thor.jpg', 'image/jpeg');
    await pick(photo, file('video.mp4', 'video/mp4'), file('raio-x.png', 'image/png', 2 * MB));

    expect(host.files.value).toEqual([photo]);
    // A parte de informações é o que o leitor lê (o selo da extensão é aria-hidden)
    expect(items().map((item) => text(item.querySelector('.arg-file-upload__info')!))).toEqual([
      'thor.jpg, 1 KB',
      'video.mp4, Tipo não aceito. Use imagens, PDF.',
      'raio-x.png, Arquivo maior que 1 MB.',
    ]);
    expect(items()[1].classList).toContain('arg-file-upload__item--error');
    expect(announce).toHaveBeenCalledWith(
      'thor.jpg adicionado. video.mp4 não foi adicionado: Tipo não aceito. Use imagens, PDF. raio-x.png não foi adicionado: Arquivo maior que 1 MB.',
      'assertive',
    );
  });

  it('arrastar e soltar adiciona; arrastando, a área muda de estado', async () => {
    const { host, el, stable } = await setup();
    const doc = file('laudo.pdf', 'application/pdf');
    const over = Object.assign(new Event('dragover', { cancelable: true }), { dataTransfer: {} });
    el.dispatchEvent(over);
    await stable();
    expect(over.defaultPrevented).toBe(true);
    expect(el.classList).toContain('arg-file-upload--dragging');

    const drop = Object.assign(new Event('drop', { cancelable: true }), {
      dataTransfer: { files: [doc] },
    });
    el.dispatchEvent(drop);
    await stable();
    expect(el.classList).not.toContain('arg-file-upload--dragging');
    expect(host.files.value).toEqual([doc]);
  });

  it('sem multiple, um arquivo novo substitui o anterior', async () => {
    const { fixture, host, pick } = await setup();
    host.multiple.set(false);
    await fixture.whenStable();
    const first = file('a.jpg', 'image/jpeg');
    const second = file('b.jpg', 'image/jpeg');
    await pick(first, second);
    expect(host.files.value).toEqual([first]);
    await pick(second);
    expect(host.files.value).toEqual([second]);
  });

  it('remover tira da lista e do valor, e o foco volta ao campo', async () => {
    const { host, pick, items, input, stable, announce } = await setup();
    await pick(file('a.jpg', 'image/jpeg'), file('b.jpg', 'image/jpeg'));
    items()[0].querySelector<HTMLButtonElement>('[aria-label="Remover a.jpg"]')!.click();
    await stable();

    expect(items()).toHaveLength(1);
    expect(host.files.value.map((f) => f.name)).toEqual(['b.jpg']);
    expect(document.activeElement).toBe(input);
    expect(announce).toHaveBeenLastCalledWith('a.jpg removido');
  });

  it('com uploader: progresso, enviado e anúncio', async () => {
    const { fixture, host, pick, items, stable, announce } = await setup();
    const { uploader, calls } = controlledUploader();
    host.uploader.set(uploader);
    await fixture.whenStable();

    await pick(file('thor.jpg', 'image/jpeg'));
    expect(calls).toHaveLength(1);
    calls[0].progress(40);
    await stable();
    const bar = items()[0].querySelector<HTMLProgressElement>('progress')!;
    expect(bar.getAttribute('value')).toBe('40');
    expect(accessibleName(bar)).toBe('Enviando thor.jpg');

    calls[0].resolve();
    // O .then do envio roda numa microtarefa depois da promessa
    await Promise.resolve();
    await stable();
    expect(items()[0].querySelector('progress')).toBeNull();
    expect(items()[0].textContent).toContain('Enviado');
    expect(announce).toHaveBeenLastCalledWith('thor.jpg enviado.');
  });

  it('erro no envio mostra "Tentar de novo", que envia outra vez', async () => {
    const { fixture, host, pick, items, stable } = await setup();
    const { uploader, calls } = controlledUploader();
    host.uploader.set(uploader);
    await fixture.whenStable();

    await pick(file('thor.jpg', 'image/jpeg'));
    calls[0].reject();
    await Promise.resolve();
    await stable();
    expect(items()[0].textContent).toContain('Não foi possível enviar.');
    // O arquivo continua no valor: só o envio falhou
    expect(host.files.value).toHaveLength(1);

    items()[0].querySelector<HTMLButtonElement>('button[arg-button]')!.click();
    await stable();
    expect(calls).toHaveLength(2);
    expect(items()[0].querySelector('progress')).not.toBeNull();
  });

  it('Reactive Forms: reset limpa a lista; disable desabilita o input', async () => {
    const { fixture, host, pick, items, input } = await setup();
    await pick(file('a.jpg', 'image/jpeg'));
    host.files.reset([]);
    await fixture.whenStable();
    expect(items()).toHaveLength(0);

    host.files.disable();
    await fixture.whenStable();
    expect(input.disabled).toBe(true);
  });

  it('não tem violações de acessibilidade, vazio e com arquivos', async () => {
    const { root, pick } = await setup();
    expect(a11yViolations(root)).toEqual([]);
    await pick(file('thor.jpg', 'image/jpeg'), file('video.mp4', 'video/mp4'));
    expect(a11yViolations(root)).toEqual([]);
  });
});
