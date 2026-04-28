// src/generation/api/api.generator.ts

export function generateApiTests(gaps: any[]) {
  const tests: string[] = [];

  gaps.forEach((gap) => {
    const { endpoint, missing } = gap;

    let test = `
describe('${endpoint} - generated tests', () => {
`;

    // 🔴 NEGATIVE TEST (CORRIGIDO)
    if (missing.includes('negative test')) {
      test += `
  it('should handle invalid request gracefully', () => {
    cy.request({
      method: 'GET',
      url: '${endpoint}?query=invalid_query_123456',
      failOnStatusCode: false
    }).then((res) => {

      // ✅ API pode retornar 200
      expect(res.status).to.be.oneOf([200, 400, 404]);

      // ✅ valida comportamento
      expect(res.body).to.exist;

      // 🔥 inteligência básica (caso search)
      if (Array.isArray(res.body.hits)) {
        expect(res.body.hits.length).to.be.lessThan(1);
      }

    });
  });
`;
    }

    // 🟡 EMPTY INPUT
    if (missing.includes('empty input')) {
      test += `
  it('should handle empty input', () => {
    cy.request({
      method: 'GET',
      url: '${endpoint}?query=',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 400]);
    });
  });
`;
    }

    // 🟣 VALIDATION
    if (missing.includes('response validation')) {
      test += `
  it('should validate response structure', () => {
    cy.request('${endpoint}?query=test')
      .then((res) => {
        expect(res.body).to.have.property('hits');
      });
  });
`;
    }

    // 🟢 SUCCESS
    if (missing.includes('success test')) {
      test += `
  it('should return successful response', () => {
    cy.request('${endpoint}?query=test')
      .then((res) => {
        expect(res.status).to.eq(200);
      });
  });
`;
    }

    test += `
});
`;

    tests.push(test);
  });

  return tests;
}