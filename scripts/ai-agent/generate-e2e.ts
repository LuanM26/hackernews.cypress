import fs from "fs";
import path from "path";
import { getApiRequests } from "./filter-runtime";
import { fixEndpoint } from "./auto-fix-endpoint";
import { testAlreadyExists } from "./test-exists";

type Endpoint = {
  method: string;
  url: string;
};

export function generateE2E(gaps: any) {
  const apis: Endpoint[] = getApiRequests();

  if (!apis.length) {
    console.log("⚠️ Nenhuma API encontrada");
    return;
  }

  const filePath = path.resolve(
    "cypress/e2e/api/auto-generated.cy.ts"
  );

  const fileExists = fs.existsSync(filePath);
  let content = "";

  const generated = new Set<string>();

  function shouldGenerate(name: string) {
    if (generated.has(name)) return false;
    if (testAlreadyExists(filePath, name)) return false;

    generated.add(name);
    return true;
  }

  // ==============================
  // HEADER
  // ==============================
  if (!fileExists) {
    content += `
describe('API Auto Generated (Smart)', () => {
`;
  }

  const baseApi = fixEndpoint(apis[0].url);

  // ==============================
  // 🔹 SUCCESS TEST
  // ==============================
  if (shouldGenerate("should validate success response")) {
    content += `
  it('should validate success response', () => {

    cy.request({
      method: 'GET',
      url: '${baseApi}',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
      expect(response.body).to.have.property('hits');
      expect(response.body.hits).to.be.an('array');

    });

  });
`;
  }

  // ==============================
  // 🔹 ERROR TEST
  // ==============================
  if (gaps.missingErrorHandling && shouldGenerate("should handle API error")) {
    content += `
  it('should handle API error', () => {

    cy.request({
      method: 'GET',
      url: '${baseApi}?invalid=true',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.not.eq(200);

    });

  });
`;
  }

  // ==============================
  // 🔹 EMPTY SEARCH
  // ==============================
  if (gaps.missingEmptySearch && shouldGenerate("should handle empty search")) {
    content += `
  it('should handle empty search', () => {

    cy.request({
      method: 'GET',
      url: '${baseApi}?query=',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.eq(200);
      expect(response.body.hits).to.be.an('array');

    });

  });
`;
  }

  // ==============================
  // 🔹 PAGINATION CONSISTENCY (🔥 CORRIGIDO)
  // ==============================
  if (gaps.missingPagination && shouldGenerate("should validate pagination consistency")) {
    const urls = apis.map(api => `'${fixEndpoint(api.url)}'`).join(",\n      ");

    content += `
  it('should validate pagination consistency', () => {

    const urls: string[] = [
      ${urls}
    ];

    const results: Cypress.Response<any>[] = [];

    cy.wrap(urls).each((url) => {

      const requestUrl = String(url);

      cy.request(requestUrl).then((res) => {
        results.push(res);
      });

    }).then(() => {

      expect(results.length).to.eq(urls.length);

      results.forEach((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('hits');
      });

      if (results.length >= 2) {
        expect(results[0].body.hits).to.not.deep.equal(
          results[1].body.hits
        );
      }

    });

  });
`;
  }

  // ==============================
  // FOOTER
  // ==============================
  if (!fileExists) {
    content += `
});
`;
  }

  if (content.trim()) {
    fs.appendFileSync(filePath, content);
    console.log("🤖 API tests gerados com qualidade alta");
  } else {
    console.log("🧠 Nenhum E2E novo necessário");
  }
}