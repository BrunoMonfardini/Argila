/**
 * Resumo dos testes para o CI: lê o JUnit do jest-junit e o
 * coverage-summary.json do Jest e monta um Markdown com totais, cobertura
 * por projeto, comparação com a main e os testes mais lentos.
 */

export type TestStatus = 'passou' | 'falhou' | 'pulado';

export interface TestCase {
  suite: string;
  name: string;
  seconds: number;
  status: TestStatus;
}

export interface JunitSummary {
  tests: TestCase[];
  seconds: number;
}

export const METRICS = ['lines', 'statements', 'branches', 'functions'] as const;
export type Metric = (typeof METRICS)[number];

interface CoverageCount {
  total: number;
  covered: number;
}

/** Formato do coverage-summary.json: uma entrada por arquivo, mais "total". */
export type CoverageSummary = Record<string, Record<Metric, CoverageCount>>;

/** Porcentagem coberta por projeto e por métrica. */
export type ProjectCoverage = Record<string, Record<Metric, number>>;

export interface CoverageChange {
  project: string;
  before: number;
  after: number;
  delta: number;
  dropped: boolean;
}

/** Projetos do repositório, pela pasta do arquivo. */
export const PROJECTS: Record<string, string> = {
  ui: 'projects/ui/',
  docs: 'projects/docs/',
  scripts: 'scripts/',
};

const decode = (text: string) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const attribute = (tag: string, name: string) =>
  decode(new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1] ?? '');

/** Lê os casos de teste de um JUnit (formato do jest-junit). */
export function parseJunit(xml: string): JunitSummary {
  const tests: TestCase[] = [];
  const pattern = /<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  for (const [, attributes, , body = ''] of xml.matchAll(pattern)) {
    const status: TestStatus = /<(failure|error)\b/.test(body)
      ? 'falhou'
      : /<skipped\b/.test(body)
        ? 'pulado'
        : 'passou';
    tests.push({
      suite: attribute(attributes, 'classname'),
      name: attribute(attributes, 'name'),
      seconds: Number(attribute(attributes, 'time')) || 0,
      status,
    });
  }
  const root = /<testsuites\b([^>]*)>/.exec(xml)?.[1] ?? '';
  const seconds = Number(attribute(root, 'time')) || tests.reduce((sum, t) => sum + t.seconds, 0);
  return { tests, seconds };
}

const percent = ({ total, covered }: CoverageCount) =>
  total === 0 ? 100 : (covered / total) * 100;

/** Soma a cobertura dos arquivos de cada projeto. `root` é removido do caminho. */
export function coverageByProject(summary: CoverageSummary, root: string): ProjectCoverage {
  const normalizedRoot = root.replace(/\\/g, '/').replace(/\/?$/, '/');
  const sums: Record<string, Record<Metric, CoverageCount>> = {};
  for (const [file, counts] of Object.entries(summary)) {
    if (file === 'total') continue;
    const path = file.replace(/\\/g, '/').replace(normalizedRoot, '');
    const project = Object.keys(PROJECTS).find((name) => path.startsWith(PROJECTS[name]));
    if (!project) continue;
    sums[project] ??= Object.fromEntries(
      METRICS.map((metric) => [metric, { total: 0, covered: 0 }]),
    ) as Record<Metric, CoverageCount>;
    for (const metric of METRICS) {
      sums[project][metric].total += counts[metric].total;
      sums[project][metric].covered += counts[metric].covered;
    }
  }
  return Object.fromEntries(
    Object.entries(sums).map(([project, counts]) => [
      project,
      Object.fromEntries(METRICS.map((metric) => [metric, percent(counts[metric])])) as Record<
        Metric,
        number
      >,
    ]),
  );
}

/**
 * Compara a cobertura de linhas de cada projeto com a da main. Cai mais do
 * que `tolerance` pontos: `dropped`. Projeto novo (sem base) não é comparado.
 */
export function compareCoverage(
  current: ProjectCoverage,
  baseline: ProjectCoverage,
  tolerance = 0.5,
): CoverageChange[] {
  return Object.keys(current)
    .filter((project) => baseline[project])
    .map((project) => {
      const before = baseline[project].lines;
      const after = current[project].lines;
      const delta = after - before;
      return { project, before, after, delta, dropped: delta < -tolerance };
    });
}

/** Os mais lentos primeiro. */
export function slowest(junit: JunitSummary, count: number): TestCase[] {
  return [...junit.tests].sort((a, b) => b.seconds - a.seconds).slice(0, count);
}

const fixed = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');
const signed = (value: number) => (value >= 0 ? '+' : '−') + fixed(Math.abs(value), 2);
const cell = (text: string) => text.replace(/\|/g, '\\|');

export interface ReportInput {
  junit: JunitSummary;
  coverage: ProjectCoverage;
  changes?: CoverageChange[];
  slowSeconds?: number;
  top?: number;
}

/** Markdown do resumo, para o $GITHUB_STEP_SUMMARY ou o terminal. */
export function renderReport({
  junit,
  coverage,
  changes = [],
  slowSeconds = 2,
  top = 10,
}: ReportInput): string {
  const count = (status: TestStatus) => junit.tests.filter((t) => t.status === status).length;
  const changeOf = (project: string) => changes.find((change) => change.project === project);
  const lines = [
    '## Testes',
    '',
    `| Total | Passaram | Falharam | Pulados | Duração |`,
    `| ----- | -------- | -------- | ------- | ------- |`,
    `| ${junit.tests.length} | ${count('passou')} | ${count('falhou')} | ${count('pulado')} | ${fixed(junit.seconds)} s |`,
    '',
    '### Cobertura por projeto',
    '',
    '| Projeto | Linhas | Branches | Funções | Statements | Linhas em relação à main |',
    '| ------- | ------ | -------- | ------- | ---------- | ------------------------ |',
    ...Object.entries(coverage).map(([project, value]) => {
      const change = changeOf(project);
      const versus = change
        ? `${signed(change.delta)} pontos${change.dropped ? ' ❌' : ''}`
        : 'sem base';
      return `| ${project} | ${fixed(value.lines)}% | ${fixed(value.branches)}% | ${fixed(value.functions)}% | ${fixed(value.statements)}% | ${versus} |`;
    }),
  ];
  const failed = junit.tests.filter((t) => t.status === 'falhou');
  if (failed.length) {
    lines.push('', '### Falharam', '', ...failed.map((t) => `- ${t.suite} › ${t.name}`));
  }
  const skipped = junit.tests.filter((t) => t.status === 'pulado');
  if (skipped.length) {
    lines.push('', '### Pulados', '', ...skipped.map((t) => `- ${t.suite} › ${t.name}`));
  }
  lines.push(
    '',
    `### ${top} mais lentos`,
    '',
    '| Teste | Duração |',
    '| ----- | ------- |',
    ...slowest(junit, top).map(
      (t) =>
        `| ${cell(`${t.suite} › ${t.name}`)} | ${fixed(t.seconds, 2)} s${t.seconds > slowSeconds ? ' ⚠️' : ''} |`,
    ),
  );
  return lines.join('\n') + '\n';
}

/** Avisos do GitHub Actions para os testes acima do limite. */
export function slowWarnings(junit: JunitSummary, slowSeconds = 2): string[] {
  return junit.tests
    .filter((t) => t.seconds > slowSeconds)
    .map(
      (t) =>
        `::warning title=Teste lento::${t.suite} › ${t.name} levou ${fixed(t.seconds, 2)} s (limite ${slowSeconds} s)`,
    );
}

export const HISTORY_HEADER =
  'data,commit,testes,falharam,duracao_s,' + Object.keys(PROJECTS).join(',');

/** Uma linha do histórico: data, commit, totais e cobertura de linhas por projeto. */
export function historyLine(
  date: string,
  commit: string,
  junit: JunitSummary,
  coverage: ProjectCoverage,
): string {
  const failed = junit.tests.filter((t) => t.status === 'falhou').length;
  const projects = Object.keys(PROJECTS).map((project) =>
    coverage[project] ? coverage[project].lines.toFixed(2) : '',
  );
  return [date, commit, junit.tests.length, failed, junit.seconds.toFixed(1), ...projects].join(
    ',',
  );
}
