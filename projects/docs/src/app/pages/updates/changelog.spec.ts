import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideDocRouter } from '../../app.routes';
import { DOC_MANIFEST, Manifest } from '../../manifest';
import { parseChangelog } from './changelog';

const CHANGELOG = `# @brunomonfardini/ui

## 0.6.0

### Minor Changes

- 651ebcf: **Novo** \`arg-tabs\` segmentado:

  - trilho em pílula;
  - teclado igual.

- 975f265: Forma de massinha
  em duas linhas.

### Patch Changes

- abc1234: Corrige o foco.

## 0.5.0

### Major Changes

- Remove o \`setBrand\`.
`;

describe('Atualizações', () => {
  it('lê versões, tipos, itens e subitens, sem hash nem negrito', () => {
    const versions = parseChangelog(CHANGELOG);

    expect(versions.map((v) => v.version)).toEqual(['0.6.0', '0.5.0']);
    expect(versions[0].groups.map((g) => g.title)).toEqual(['Novidades', 'Correções']);
    expect(versions[0].groups[0].entries).toEqual([
      { text: 'Novo `arg-tabs` segmentado:', items: ['trilho em pílula;', 'teclado igual.'] },
      { text: 'Forma de massinha em duas linhas.', items: [] },
    ]);
    expect(versions[1].groups[0]).toEqual({
      title: 'Mudanças que quebram',
      entries: [{ text: 'Remove o `setBrand`.', items: [] }],
    });
  });

  it('changelog vazio não tem versões', () => {
    expect(parseChangelog('')).toEqual([]);
  });

  it('a página mostra as versões, com o código em <code>', async () => {
    const manifest: Manifest = { pages: {}, tokens: [], changelog: CHANGELOG };
    TestBed.configureTestingModule({
      providers: [provideDocRouter(), { provide: DOC_MANIFEST, useValue: manifest }],
    });
    const harness = await RouterTestingHarness.create('/comeco/atualizacoes');
    const root = harness.routeNativeElement!;

    expect(root.querySelector('h1')?.textContent).toBe('Atualizações');
    expect(Array.from(root.querySelectorAll('h2'), (h) => h.textContent)).toEqual([
      '0.6.0',
      '0.5.0',
    ]);
    expect(root.querySelector('li code')?.textContent).toBe('arg-tabs');
    expect(document.title).toBe('Atualizações · Argila');
  });

  it('sem changelog no manifesto, avisa que não há versões', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideDocRouter(),
        { provide: DOC_MANIFEST, useValue: { pages: {}, tokens: [] } },
      ],
    });
    const harness = await RouterTestingHarness.create('/comeco/atualizacoes');

    expect(harness.routeNativeElement?.textContent).toContain('Ainda não há versões publicadas.');
  });
});
