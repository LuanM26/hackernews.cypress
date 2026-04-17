import '@cypress/grep'
import 'cypress-iframe'
import './commands'

// comando customizado
Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-cy=${selector}]`)
})
afterEach(function () {
  if (this.currentTest?.state === "failed") {
    const filePath = "scripts/ai-agent/test-failures.json";

    cy.readFile(filePath, {
      log: false,
      failOnNonExisting: false,
    }).then((existing) => {
      const safe = Array.isArray(existing) ? existing : [];

      const updated = [
        ...safe,
        {
          title: this.currentTest.title,
          error: this.currentTest.err?.message,
          file: Cypress.spec.name,
        },
      ];

      cy.writeFile(filePath, updated, { log: false });
    });
  }
});