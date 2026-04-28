// src/generation/e2e/e2e.generator.ts

export function generateE2ETests(gaps: any[]) {
  const tests: string[] = [];

  gaps.forEach((gap) => {
    const { endpoint } = gap;

    // 🔥 só gera para endpoints conhecidos
    if (!endpoint.includes('/search')) return;

    const test = `
describe('${endpoint} - generated E2E', () => {

  it('should perform valid search flow', () => {

    cy.visit('/');

    cy.get('input')
      .should('be.visible')
      .clear()
      .type('react'); // ✅ valor válido

    cy.get('form').submit();

    cy.get('.table-row')
      .should('exist')
      .and('have.length.greaterThan', 0);

  });

});
`;

    tests.push(test);
  });

  return tests;
}