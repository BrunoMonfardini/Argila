/**
 * Gera o manifesto do catálogo a partir do código da biblioteca.
 *
 *   node scripts/gerar-manifesto.ts           grava o manifest.json
 *   node scripts/gerar-manifesto.ts --check   só confere o catálogo (usado no CI)
 *
 * Em desenvolvimento, para regerar quando um componente muda:
 *   node --watch-path=projects/ui/src --watch-path=projects/ui/tokens scripts/gerar-manifesto.ts
 */
import { existsSync, globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { buildManifest, checkCatalog } from './lib/manifesto.ts';

const root = process.cwd();
const outFile = resolve(root, 'projects/docs/src/generated/manifest.json');
const docsFiles = globSync('projects/ui/src/**/*.docs.ts').map((file) => resolve(root, file));

if (process.argv.includes('--check')) {
  const problems = checkCatalog({
    root,
    publicApi: resolve(root, 'projects/ui/src/public-api.ts'),
    docsFiles,
    registryFile: resolve(root, 'projects/docs/src/app/registry.ts'),
  });
  for (const problem of problems) {
    console.error(problem);
  }
  console.log(
    problems.length
      ? `${problems.length} problema(s) no catálogo.`
      : `Catálogo em dia: ${docsFiles.length} página(s), todo componente exportado documentado.`,
  );
  process.exitCode = problems.length ? 1 : 0;
} else {
  const manifest = buildManifest({
    root,
    docsFiles,
    semanticCss: readFileSync(resolve(root, 'projects/ui/tokens/semantic.css'), 'utf8'),
  });

  const json = JSON.stringify(manifest, null, 2) + '\n';
  // Só grava quando muda, para não disparar recompilação à toa no modo watch.
  if (!existsSync(outFile) || readFileSync(outFile, 'utf8') !== json) {
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, json);
  }
  console.log(
    `Manifesto: ${Object.keys(manifest.pages).length} página(s), ${manifest.tokens.length} token(s).`,
  );
}
