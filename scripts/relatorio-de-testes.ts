/**
 * Resumo dos testes: totais, cobertura por projeto, comparação com a main e
 * os testes mais lentos. Roda depois do `pnpm test`.
 *
 *   node scripts/relatorio-de-testes.ts [--junit reports/junit.xml]
 *     [--cobertura coverage/coverage-summary.json]
 *     [--base cobertura-main/coverage-summary.json] [--historico cobertura-main/historico.csv]
 *
 * Imprime o Markdown no terminal (o CI manda para o $GITHUB_STEP_SUMMARY).
 * No GitHub Actions, avisa cada teste acima de 2 s. Termina com código 1 se a
 * cobertura de linhas de algum projeto cair mais de 0,5 ponto em relação à base.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  HISTORY_HEADER,
  compareCoverage,
  coverageByProject,
  historyLine,
  parseJunit,
  renderReport,
  slowWarnings,
  type CoverageSummary,
} from './lib/relatorio-de-testes.ts';

const ROOT = resolve(import.meta.dirname, '..');
const { values: options } = parseArgs({
  options: {
    junit: { type: 'string', default: 'reports/junit.xml' },
    cobertura: { type: 'string', default: 'coverage/coverage-summary.json' },
    base: { type: 'string' },
    historico: { type: 'string' },
  },
});

const readJson = (path: string) =>
  JSON.parse(readFileSync(resolve(ROOT, path), 'utf8')) as CoverageSummary;

const junit = parseJunit(readFileSync(resolve(ROOT, options.junit), 'utf8'));
const coverage = coverageByProject(readJson(options.cobertura), ROOT);
const baseline =
  options.base && existsSync(resolve(ROOT, options.base))
    ? coverageByProject(readJson(options.base), ROOT)
    : undefined;
const changes = baseline ? compareCoverage(coverage, baseline) : [];

process.stdout.write(renderReport({ junit, coverage, changes }));

if (process.env.GITHUB_ACTIONS) {
  for (const warning of slowWarnings(junit)) console.error(warning);
}

if (options.historico) {
  const file = resolve(ROOT, options.historico);
  if (!existsSync(file)) writeFileSync(file, HISTORY_HEADER + '\n');
  const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  appendFileSync(file, historyLine(new Date().toISOString(), commit, junit, coverage) + '\n');
}

const dropped = changes.filter((change) => change.dropped);
if (dropped.length) {
  for (const change of dropped) {
    console.error(
      `Cobertura de linhas de ${change.project} caiu ${Math.abs(change.delta).toFixed(2)} pontos em relação à main (máximo 0,5).`,
    );
  }
  process.exitCode = 1;
}
