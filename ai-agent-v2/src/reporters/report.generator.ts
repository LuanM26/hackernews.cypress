// src/report/report.generator.ts

import { ReportData } from '../types/agent.types';

export function generateReport(data: ReportData): void {
  console.log('\n📊 QA REPORT\n');

  console.log(`📊 QA Score: ${data.qaScore.score}%\n`);

  console.log('📌 Endpoints analisados:');
  data.endpoints.forEach((endpoint) => {
    console.log(`- ${endpoint}`);
  });

  console.log('\n🧠 Cobertura por cenário:\n');

  Object.entries(data.qaScore.details).forEach(([endpoint, checks]) => {
    console.log(endpoint);

    Object.entries(checks).forEach(([checkName, passed]) => {
      console.log(`  ${passed ? '✔' : '❌'} ${checkName}`);
    });

    console.log('');
  });

  if (data.gaps.length > 0) {
    console.log('🚨 Gaps detectados:\n');

    data.gaps.forEach((gap) => {
      console.log(gap.endpoint);

      gap.missing.forEach((m) => {
        console.log(`  - missing: ${m}`);
      });

      console.log('');
    });
  } else {
    console.log('✅ Nenhum gap detectado\n');
  }
}