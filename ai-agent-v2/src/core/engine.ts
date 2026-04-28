// src/core/engine.ts

import { readE2ETests } from '../readers/e2e.reader';
import { extractEndpoints } from '../analysis/endpoints/endpoints.extractor';
import { analyzeCoverage } from '../analysis/coverage/coverage.analyzer';
import { analyzeScenarios } from '../analysis/quality/scenario.analyzer';
import { detectGaps } from '../analysis/gaps/gaps.detector';
import { calculateQAScore } from '../intelligence/qa.score';
import { generateApiTests } from '../generation/api/api.generator';
import { generateE2ETests } from '../generation/e2e/generator';
import { analyzeE2EFlows } from '../analysis/e2e/e2e.flow.analyzer';
import { detectE2EGaps } from '../analysis/e2e/gap.detector';
import { saveGeneratedTests } from '../utils/file.utils';
import { generateReport } from '../reporters/report.generator';
import { updateReadme } from '../reporters/readme.writer';
import { getConfig } from '../config/agent.config';



export async function runAgent() {
  console.log('🚀 AI QA Agent V2 iniciado\n');

  // =============================
  // CONFIG
  // =============================
  const config = getConfig();

  console.log(`🧠 Modo de execução: ${config.mode}\n`);

  // =============================
  // READ
  // =============================
  console.log('📥 Lendo projeto...');
  const e2eTests = readE2ETests();

  // =============================
  // ANALYSIS
  // =============================
  console.log('🔍 Analisando cobertura...');

  const endpoints = extractEndpoints(e2eTests);
  console.log('🌐 Endpoints encontrados:', endpoints);

  const coverage = analyzeCoverage(endpoints);
  console.log('📊 Coverage:', coverage);

  const scenarioAnalysis = analyzeScenarios(e2eTests);
  console.log('🧠 Cenários detectados:', scenarioAnalysis);

  const gaps = detectGaps(endpoints, scenarioAnalysis);
  console.log('🧠 Gaps encontrados:', gaps);

  const qaScore = calculateQAScore(scenarioAnalysis);
  console.log('📊 QA Score:', qaScore);

  // =============================
  // GENERATION
  // =============================
  console.log('🧪 Gerando testes...');

  const apiTests = generateApiTests(gaps);
  const e2eTestsGenerated = generateE2ETests(gaps);

  console.log(`🧪 API tests gerados: ${apiTests.length}`);
  console.log(`🧪 E2E tests gerados: ${e2eTestsGenerated.length}`);

  // =============================
  // SAVE (SEPARADO POR TIPO)
  // =============================
  if (apiTests.length > 0) {
    saveGeneratedTests(apiTests, 'api');
  }

  if (e2eTestsGenerated.length > 0) {
    saveGeneratedTests(e2eTestsGenerated, 'e2e');
  }

  if (apiTests.length === 0 && e2eTestsGenerated.length === 0) {
    console.log('✔ Nenhum teste necessário (cobertura completa)');
  }

  // =============================
  // REPORT
  // =============================
  console.log('\n📊 Gerando relatório...');

  generateReport({
    endpoints,
    coverage,
    gaps,
    qaScore
  });

  updateReadme({
    endpoints,
    coverage,
    gaps,
    qaScore
  });

  console.log('\n✅ Agent finalizado\n');
}