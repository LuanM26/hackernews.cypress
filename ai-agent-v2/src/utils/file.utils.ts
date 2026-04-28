import * as fs from 'fs';
import * as path from 'path';
import { getConfig } from '../config/agent.config';

export function saveGeneratedTests(
  tests: string[],
  type: 'api' | 'e2e'
) {
  const config = getConfig();

  const outputDir = path.join(
    config.projectRoot,
    `cypress/e2e/generated/${type}`
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  tests.forEach((test, index) => {
    const filePath = path.join(
      outputDir,
      `generated-${Date.now()}-${index}.cy.js`
    );

    fs.writeFileSync(filePath, test);

    console.log(`💾 [${type.toUpperCase()}] Teste salvo em: ${filePath}`);
  });
}