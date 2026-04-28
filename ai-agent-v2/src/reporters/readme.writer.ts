// src/report/readme.updater.ts

import * as fs from 'fs';
import * as path from 'path';
import { getConfig } from '../config/agent.config';
import { ReportData } from '../types/agent.types';

export function updateReadme(data: ReportData): void {
  const config = getConfig();

  const readmePath = path.join(config.projectRoot, 'README.md');

  let content = '';

  content += `# 🤖 AI QA Agent Report\n\n`;

  content += `## 📊 QA Score\n\n`;
  content += `**${data.qaScore.score}%**\n\n`;

  content += `## 📌 Endpoints analisados\n\n`;
  data.endpoints.forEach((ep) => {
    content += `- ${ep}\n`;
  });

  content += `\n`;

  content += `## 🧠 Cobertura por cenário\n\n`;

  Object.entries(data.qaScore.details).forEach(([endpoint, checks]) => {
    content += `### ${endpoint}\n\n`;

    Object.entries(checks).forEach(([checkName, passed]) => {
      content += `- ${passed ? '✅' : '❌'} ${checkName}\n`;
    });

    content += `\n`;
  });

  if (data.gaps.length > 0) {
    content += `## 🚨 Gaps detectados\n\n`;

    data.gaps.forEach((gap) => {
      content += `### ${gap.endpoint}\n\n`;

      gap.missing.forEach((m) => {
        content += `- missing: ${m}\n`;
      });

      content += `\n`;
    });
  } else {
    content += `## ✅ Nenhum gap detectado\n\n`;
  }

  fs.writeFileSync(readmePath, content);

  console.log('📝 README atualizado com QA Report');
}