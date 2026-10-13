import { acceptsType, describeAccept, fileProblem, formatSize } from './files';

const file = (name: string, type: string, size = 1000) => ({ name, type, size });

describe('arquivos', () => {
  it('formatam o tamanho', () => {
    expect(formatSize(500)).toBe('500 bytes');
    expect(formatSize(1536)).toBe('1,5 KB');
    expect(formatSize(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatSize(1.25 * 1024 ** 3)).toBe('1,3 GB');
  });

  it('aceitam por extensão, tipo exato e curinga', () => {
    expect(acceptsType(file('foto.JPG', 'image/jpeg'), 'image/*')).toBe(true);
    expect(acceptsType(file('laudo.pdf', 'application/pdf'), 'image/*,.pdf')).toBe(true);
    expect(acceptsType(file('laudo.pdf', 'application/pdf'), 'application/pdf')).toBe(true);
    expect(acceptsType(file('planilha.xlsx', 'application/vnd.ms-excel'), 'image/*,.pdf')).toBe(
      false,
    );
    expect(acceptsType(file('qualquer.zip', 'application/zip'), '')).toBe(true);
  });

  it('descrevem o accept para a mensagem', () => {
    expect(describeAccept('image/*,.pdf')).toBe('imagens, PDF');
    expect(describeAccept('image/png, image/jpeg')).toBe('PNG, JPEG');
  });

  it('dizem o motivo da recusa: tipo antes de tamanho', () => {
    const rules = { accept: 'image/*,.pdf', maxSize: 5 * 1024 * 1024 };
    expect(fileProblem(file('foto.jpg', 'image/jpeg', 1024), rules)).toBeNull();
    expect(fileProblem(file('video.mp4', 'video/mp4', 1024), rules)).toBe(
      'Tipo não aceito. Use imagens, PDF.',
    );
    expect(fileProblem(file('foto.jpg', 'image/jpeg', 6 * 1024 * 1024), rules)).toBe(
      'Arquivo maior que 5 MB.',
    );
    expect(fileProblem(file('foto.jpg', 'image/jpeg', 10 ** 9), {})).toBeNull();
  });
});
