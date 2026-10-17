import { describe, expect, it } from '@jest/globals';
import {
  HISTORY_HEADER,
  compareCoverage,
  coverageByProject,
  historyLine,
  parseJunit,
  renderReport,
  slowWarnings,
  slowest,
  type CoverageSummary,
  type JunitSummary,
} from './relatorio-de-testes.ts';

const JUNIT = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="jest tests" tests="4" failures="1" errors="0" time="12.5">
  <testsuite name="ArgButton" tests="2" time="1.2">
    <testcase classname="ArgButton" name="renderiza &quot;salvar&quot;" time="0.2">
    </testcase>
    <testcase classname="ArgButton" name="fica desabilitado" time="3.4">
      <failure>Expected true</failure>
    </testcase>
  </testsuite>
  <testsuite name="ArgCard" tests="2" time="0.5">
    <testcase classname="ArgCard" name="pula" time="0">
      <skipped/>
    </testcase>
    <testcase classname="ArgCard" name="sem corpo" time="0.05"/>
  </testsuite>
</testsuites>`;

const count = (covered: number, total: number) => ({ covered, total });
const file = (covered: number, total: number) => ({
  lines: count(covered, total),
  statements: count(covered, total),
  branches: count(covered, total),
  functions: count(covered, total),
});

const SUMMARY: CoverageSummary = {
  total: file(0, 0),
  'C:\\repo\\projects\\ui\\src\\lib\\button\\button.ts': file(9, 10),
  'C:\\repo\\projects\\ui\\src\\lib\\card\\card.ts': file(10, 10),
  'C:\\repo\\projects\\docs\\src\\app\\app.ts': file(1, 2),
  'C:\\repo\\scripts\\lib\\temas.ts': file(0, 0),
  'C:\\repo\\outro\\fora.ts': file(0, 5),
};

describe('parseJunit', () => {
  it('lê nome, suíte, duração e situação de cada caso, inclusive os sem corpo', () => {
    const junit = parseJunit(JUNIT);

    expect(junit.seconds).toBe(12.5);
    expect(junit.tests).toEqual([
      { suite: 'ArgButton', name: 'renderiza "salvar"', seconds: 0.2, status: 'passou' },
      { suite: 'ArgButton', name: 'fica desabilitado', seconds: 3.4, status: 'falhou' },
      { suite: 'ArgCard', name: 'pula', seconds: 0, status: 'pulado' },
      { suite: 'ArgCard', name: 'sem corpo', seconds: 0.05, status: 'passou' },
    ]);
  });

  it('soma as durações quando o JUnit não traz o total', () => {
    const junit = parseJunit(
      '<testcase classname="a" name="b" time="1.5"/><testcase name="c" time="x"/>',
    );

    expect(junit.seconds).toBe(1.5);
    expect(junit.tests[1]).toEqual({ suite: '', name: 'c', seconds: 0, status: 'passou' });
  });
});

describe('coverageByProject', () => {
  it('soma os arquivos de cada projeto e ignora o total e o que está fora', () => {
    const coverage = coverageByProject(SUMMARY, 'C:\\repo');

    expect(Object.keys(coverage)).toEqual(['ui', 'docs', 'scripts']);
    expect(coverage['ui'].lines).toBe(95);
    expect(coverage['docs'].branches).toBe(50);
    // Projeto sem nada para cobrir conta como 100%
    expect(coverage['scripts'].functions).toBe(100);
  });
});

describe('compareCoverage', () => {
  const current = coverageByProject(SUMMARY, 'C:/repo/');

  it('marca a queda de mais de 0,5 ponto e aceita até 0,5', () => {
    const baseline = {
      ui: { ...current['ui'], lines: 95.5 },
      docs: { ...current['docs'], lines: 50.6 },
    };

    const changes = compareCoverage(current, baseline);

    expect(changes).toEqual([
      { project: 'ui', before: 95.5, after: 95, delta: -0.5, dropped: false },
      {
        project: 'docs',
        before: 50.6,
        after: 50,
        delta: expect.closeTo(-0.6, 5),
        dropped: true,
      },
    ]);
  });
});

describe('renderReport', () => {
  const junit = parseJunit(JUNIT);
  const coverage = coverageByProject(SUMMARY, 'C:\\repo');

  it('mostra totais, cobertura, falhas, pulados e os mais lentos', () => {
    const changes = compareCoverage(coverage, { ui: { ...coverage['ui'], lines: 97 } });

    const report = renderReport({ junit, coverage, changes, top: 2 });

    expect(report).toContain('| 4 | 2 | 1 | 1 | 12,5 s |');
    expect(report).toContain('| ui | 95,0% | 95,0% | 95,0% | 95,0% | −2,00 pontos ❌ |');
    expect(report).toContain('| docs | 50,0% | 50,0% | 50,0% | 50,0% | sem base |');
    expect(report).toContain('### Falharam\n\n- ArgButton › fica desabilitado');
    expect(report).toContain('### Pulados\n\n- ArgCard › pula');
    expect(report).toContain('| ArgButton › fica desabilitado | 3,40 s ⚠️ |');
    expect(report).toContain('| ArgButton › renderiza "salvar" | 0,20 s |');
    expect(report).not.toContain('sem corpo');
  });

  it('sem falhas nem pulados, não mostra as seções', () => {
    const clean: JunitSummary = { seconds: 1, tests: [junit.tests[0]] };

    const report = renderReport({ junit: clean, coverage });

    expect(report).not.toContain('### Falharam');
    expect(report).not.toContain('### Pulados');
    expect(report).toContain('### Cobertura por projeto');
  });

  it('escapa a barra vertical no nome do teste', () => {
    const piped: JunitSummary = {
      seconds: 1,
      tests: [{ suite: 'a|b', name: 'c', seconds: 1, status: 'passou' }],
    };

    expect(renderReport({ junit: piped, coverage: {} })).toContain('| a\\|b › c | 1,00 s |');
  });
});

describe('slowest e slowWarnings', () => {
  const junit = parseJunit(JUNIT);

  it('ordena do mais lento para o mais rápido', () => {
    expect(slowest(junit, 2).map((t) => t.name)).toEqual([
      'fica desabilitado',
      'renderiza "salvar"',
    ]);
  });

  it('avisa só os testes acima do limite, no formato do GitHub Actions', () => {
    expect(slowWarnings(junit, 2)).toEqual([
      '::warning title=Teste lento::ArgButton › fica desabilitado levou 3,40 s (limite 2 s)',
    ]);
  });
});

describe('historyLine', () => {
  it('registra data, commit, totais e a cobertura de linhas de cada projeto', () => {
    const junit = parseJunit(JUNIT);
    const coverage = coverageByProject(SUMMARY, 'C:\\repo');
    delete coverage['scripts'];

    const line = historyLine('2026-10-17', 'abc123', junit, coverage);

    expect(HISTORY_HEADER).toBe('data,commit,testes,falharam,duracao_s,ui,docs,scripts');
    expect(line).toBe('2026-10-17,abc123,4,1,12.5,95.00,50.00,');
  });
});
