import fs from "fs";
import path from "path";
import { getApiRequests } from "./filter-runtime";
import { fixEndpoint } from "./auto-fix-endpoint";
import { testAlreadyExists } from "./test-exists";

// 🆕 NOVO IMPORT (IA de cenários)
import { generateScenarios } from "./ai-scenario-generator";

type Endpoint = {
  method: string;
  url: string;
};

export function generateTests(gaps: any) {
  const apis: Endpoint[] = getApiRequests();

  if (!apis.length) {
    console.log("⚠️ Nenhuma API encontrada");
    return;
  }

  const filePath = path.resolve("cypress/e2e/api/auto-generated.cy.ts");
  const fileExists = fs.existsSync(filePath);

  let content = "";

  // ==============================
  // 🧠 DEDUPE
  // ==============================
  const generated = new Set<string>();

  function shouldGenerate(name: string) {
    if (generated.has(name)) return false;
    if (testAlreadyExists(filePath, name)) return false;

    generated.add(name);
    return true;
  }

  const baseApi = apis[0];
  const url = fixEndpoint(baseApi.url);

  // ==============================
  // 🔥 HEADER
  // ==============================
  if (!fileExists) {
    content += `
describe('API Auto Generated (Smart)', () => {
`;
  }

  // ==============================
  // ✅ HAPPY PATH (QUALIDADE ALTA)
  // ==============================
  const successTest = "should validate API response fully";

  if (shouldGenerate(successTest)) {
    content += `
  it('${successTest}', () => {

    cy.request({
      method: '${baseApi.method}',
      url: '${url}',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.eq(200);
      expect(response.body).to.exist;

      if (typeof response.body === 'string' && response.body.includes('<html')) {
        throw new Error('❌ API retornou HTML');
      }

      expect(response.body).to.have.property('hits');
      expect(response.body.hits).to.be.an('array');
      expect(response.body.hits.length).to.be.greaterThan(0);

    });

  });
`;
  }

  // ==============================
  // ❌ ERROR HANDLING (GAP)
  // ==============================
  if (gaps.missingErrorHandling) {
    const errorTest = "should handle invalid query";

    if (shouldGenerate(errorTest)) {
      content += `
  it('${errorTest}', () => {

    cy.request({
      url: '${url}?query=INVALID_TEST_123',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 400]);

    });

  });
`;
    }
  }

  // ==============================
  // 🔁 PAGINATION (GAP)
  // ==============================
  if (gaps.missingPagination && apis.length > 1) {
    const paginationTest = "should validate pagination consistency";

    if (shouldGenerate(paginationTest)) {
      const urls = apis.map(a => fixEndpoint(a.url));

      content += `
  it('${paginationTest}', () => {

    const urls = ${JSON.stringify(urls, null, 2)};
    const results = [];

    urls.forEach((url) => {
      cy.request(url).then((res) => {
        results.push(res);
      });
    });

    cy.then(() => {

      results.forEach((res) => {
        expect(res.status).to.eq(200);
      });

      if (results.length >= 2) {
        expect(results[0].body.hits).to.not.deep.equal(results[1].body.hits);
      }

    });

  });
`;
    }
  }

  // ==============================
  // 🧠 🆕 IA SCENARIOS (NOVO BLOCO)
  // ==============================
  const scenarios = generateScenarios(url);

  scenarios.forEach((scenario) => {
    if (!shouldGenerate(scenario.name)) return;

    const query = scenario.request?.query ?? "redux";
    const page = scenario.request?.page ?? 0;

    const scenarioUrl = `${url}?query=${encodeURIComponent(query)}&page=${page}`;

    content += `
  it('${scenario.name}', () => {

    cy.request({
      method: '${baseApi.method}',
      url: '${scenarioUrl}',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 400, 404]);

      if (response.body && typeof response.body === 'object') {
        if (response.body.hits) {
          expect(response.body.hits).to.be.an('array');
        }
      }

    });

  });
`;
  });

  // ==============================
  // 🔚 FOOTER
  // ==============================
  if (!fileExists) {
    content += `
});
`;
  }

  if (content.trim()) {
    fs.appendFileSync(filePath, content);
    console.log("🤖 API tests gerados com IA + qualidade alta");
  } else {
    console.log("🧠 Nenhum teste novo necessário");
  }
}