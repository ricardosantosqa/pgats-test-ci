const fs = require('fs');

const summaryPath = process.env.GITHUB_STEP_SUMMARY;

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function statusLabel(outcome) {
  return outcome === 'success' ? 'sucesso' : 'falha';
}

function formatLine(name, outcome, totals) {
  if (!totals) {
    return `- ${name}: relatório indisponível; resultado da etapa: ${statusLabel(outcome)}.`;
  }

  const skipped = totals.skipped ? `, ${totals.skipped} ignorado(s)` : '';
  return `- ${name} finalizados com ${statusLabel(outcome)}: ${totals.passed} passou/passaram, ${totals.failed} falhou/falharam${skipped}, ${totals.total} total.`;
}

function getUnitTotals() {
  const result = readJson('reports/unit-results.json');
  if (!result) return null;

  return {
    passed: result.numPassedTests || 0,
    failed: result.numFailedTests || 0,
    skipped: result.numPendingTests || 0,
    total: result.numTotalTests || 0,
  };
}

function getFunctionalTotals() {
  const result = readJson('reports/functional-results.json');
  if (!result || !result.stats) return null;

  const passed = result.stats.expected || 0;
  const failed = result.stats.unexpected || 0;
  const flaky = result.stats.flaky || 0;
  const skipped = result.stats.skipped || 0;

  return {
    passed: passed + flaky,
    failed,
    skipped,
    total: passed + failed + flaky + skipped,
  };
}

const unitOutcome = process.env.UNIT_OUTCOME || 'unknown';
const functionalOutcome = process.env.FUNCTIONAL_OUTCOME || 'unknown';
const runUrl = process.env.RUN_URL;

const lines = [
  '## Resultado da Esteira de Testes',
  '',
  formatLine('Testes unitários', unitOutcome, getUnitTotals()),
  formatLine('Testes funcionais', functionalOutcome, getFunctionalTotals()),
  '',
  '| Relatório | Local |',
  '|----------|-------|',
  '| Unitários JUnit | `junit.xml` |',
  '| Unitários cobertura | `coverage/` |',
  '| Funcionais JUnit | `reports/functional-junit.xml` |',
  '| Funcionais HTML | `playwright-report/` |',
];

if (runUrl) {
  lines.push('', `Relatório completo da execução: ${runUrl}`);
}

const output = `${lines.join('\n')}\n`;

if (summaryPath) {
  fs.appendFileSync(summaryPath, output);
} else {
  process.stdout.write(output);
}
