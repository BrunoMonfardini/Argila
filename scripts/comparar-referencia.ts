/**
 * Compara cada design system com a imagem de referência dele.
 *
 * Com o catálogo rodando (`npm run dev`), captura a página do DS em cada modo
 * e monta `comparacao/<ds>.html` com a referência ao lado. Fica fora do git e
 * do catálogo publicado: as imagens de referência são só do time.
 *
 *   node scripts/comparar-referencia.ts [--ds argila,punk] [--url http://localhost:4200]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  comparisonHtml,
  comparisonShots,
  comparisonTargets,
  comparisonUrl,
} from './lib/comparacao.ts';
import { loadDesignSystems } from './lib/design-systems.ts';
import { openBrowser } from './lib/navegador.ts';

const { values: options } = parseArgs({
  options: {
    url: { type: 'string', default: 'http://localhost:4200' },
    ds: { type: 'string' },
    saida: { type: 'string', default: 'comparacao' },
  },
});

const ROOT = resolve(import.meta.dirname, '..');
const output = resolve(ROOT, options.saida);
const only = options.ds?.split(',').map((id) => id.trim());
const targets = comparisonTargets(await loadDesignSystems(ROOT), only);
mkdirSync(output, { recursive: true });

const browser = await openBrowser();
for (const ds of targets) {
  const shots = comparisonShots(ds);
  for (const shot of shots) {
    // Cada captura começa do zero: o link escolhe o DS e o modo
    await browser.load(comparisonUrl(options.url, ds, shot.mode));
    await browser.evaluate('localStorage.clear(); document.fonts.ready.then(() => 0)');
    await browser.load(comparisonUrl(options.url, ds, shot.mode));
    await browser.screenshot(join(output, shot.file));
  }
  const reference = relative(output, resolve(ROOT, 'docs/referencias', ds.referencia!)).replaceAll(
    '\\',
    '/',
  );
  const file = join(output, `${ds.id}.html`);
  writeFileSync(file, comparisonHtml({ name: ds.nome, reference, shots }));
  console.log(`${ds.nome}: ${file}`);
}
browser.close();
