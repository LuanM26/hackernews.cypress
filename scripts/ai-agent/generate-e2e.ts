import fs from "fs";
import path from "path";
import { extractUIFlows } from "./extract-ui-flow";
import { detectErrors } from "./detect-errors";

export function generateE2ETests() {
    const flows = extractUIFlows();

    const validFlows = flows.filter(f => f.actions && f.actions.length > 0);

    let content = `
describe('E2E Auto Generated (Intelligent)', () => {

  beforeEach(() => {
    cy.visit('/');
  });
`;

    validFlows.forEach((flow, index) => {
        content += `
  it('intelligent flow ${index + 1}', () => {
    ${detectErrors()}

    Cypress.on('uncaught:exception', () => false);

    cy.intercept('GET', '**/search*').as('search');
`;

        let hasInput = false;
        let hasButton = false;
        let hasList = false;

        flow.actions.forEach((action: string) => {

            if (action.startsWith("get")) {
                let selector = action.replace("get ", "").trim();

                if (selector.includes("@")) return;

                selector = selector.replace(/^['"]|['"]$/g, "");

                if (selector.includes(":nth-child(") && !selector.includes(")")) {
                    selector = selector + ")";
                }

                // 🧠 INPUT DETECTADO
                if (selector === "input" && !hasInput) {
                    content += `
    cy.get('${selector}')
      .should('be.visible')
      .type('redux');
`;
                    hasInput = true;
                }

                // 🧠 BUTTON DETECTADO
                else if (selector.includes("button") && !hasButton) {
                    content += `
    cy.get('${selector}')
      .should('be.visible')
      .click();
`;
                    hasButton = true;
                }

                // 🧠 LIST DETECTADA
                else if (selector.includes("table-row") && !hasList) {
                    content += `
    cy.get('${selector}')
      .should('have.length.greaterThan', 0);
`;
                    hasList = true;
                }

                // 🧠 LINK
                else if (selector.includes("a")) {
                    content += `
    cy.get('${selector}')
      .should('exist');
`;
                }
            }

        });

        // 🧠 VALIDAÇÃO DE API
        content += `
    cy.wait('@search')
      .its('response.statusCode')
      .should('eq', 200);
`;

        content += `
  });
`;
    });

    content += `
});
`;

    const filePath = path.resolve(
        process.cwd(),
        "cypress/e2e/tests/auto-generated-e2e.cy.ts"
    );

    console.log("📁 Writing intelligent E2E to:", filePath);

    fs.writeFileSync(filePath, content);

    console.log("\n🔥 INTELLIGENT E2E GENERATED\n");
}