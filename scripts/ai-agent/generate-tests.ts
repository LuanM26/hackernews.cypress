import fs from "fs";
import path from "path";
import { compareCoverage } from "./compare-coverage";
import { isValidEndpoint } from "./endpoint-validator";
import { getApiRequests } from "./filter-runtime";

// ================= TYPES =================

type Coverage = {
  endpoint: string;
  method: string;
  covered: boolean;
};

// ================= MAIN =================

export function generateTests() {
  const coverage: Coverage[] = compareCoverage();
  const realApis = getApiRequests();


  let content = `describe('API Auto Generated', () => {\n\n`;

  coverage.forEach((item) => {
    const endpoint = item.endpoint;
    const method = item.method;

    // 🔥 valida se endpoint realmente existe
    const isValid = isValidEndpoint(endpoint, method, realApis);

    if (!isValid) {
      console.log(`⚠️ Ignorando endpoint inválido: ${method} ${endpoint}`);
      return;
    }

    content += `  it('${method} ${endpoint}', () => {\n`;

    // ================= REQUEST =================

    content += `    cy.request({\n`;
    content += `      method: '${method}',\n`;
    content += `      url: '${endpoint}',\n`;
    content += `      failOnStatusCode: false\n`;
    content += `    }).then((response) => {\n`;

    // ================= ASSERT =================

    content += `      expect(response.status).to.be.oneOf([200, 201, 204, 304]);\n`;

    content += `    });\n`;
    content += `  });\n\n`;
  });

  content += `});`;

  // ================= SAVE =================

  const filePath = path.resolve(
    "cypress/e2e/api/auto-generated.cy.ts"
  );

  fs.writeFileSync(filePath, content);

  console.log("🤖 Testes de API gerados com validação real");
}