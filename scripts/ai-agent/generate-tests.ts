import fs from "fs";
import { extractUIFlows } from "./extract-ui-flow";

export function generateE2ETests() {
  const flows = extractUIFlows();

  const validFlows = flows.filter(f => f.actions && f.actions.length > 0);

  let content = `
describe('E2E Auto Generated', () => {

  beforeEach(() => {
    cy.visit('/');
  });
`;

  validFlows.forEach((flow, index) => {
    content += `
  it('auto flow ${index + 1} - ${flow.file}', () => {
`;

    let hasAnyStep = false;

    flow.actions.forEach((action: string) => {

      // 👉 VISIT
      if (action.startsWith("visit")) {
        const url = action.replace("visit ", "").trim();
        content += `    cy.visit(${url});\n`;
        hasAnyStep = true;
      }

      // 👉 GET
      if (action.startsWith("get")) {
        let selector = action.replace("get ", "").trim();

        // ❌ ignora alias (@algo)
        if (selector.includes("@")) return;

        // limpa aspas
        selector = selector.replace(/^['"]|['"]$/g, "");

        // corrige nth-child quebrado
        if (selector.includes(":nth-child(") && !selector.includes(")")) {
          selector = selector + ")";
        }

        // evita selector inválido vazio
        if (!selector || selector.length < 2) return;

        content += `    cy.get('${selector}').should('be.visible');\n`;
        hasAnyStep = true;
      }

      // 👉 TYPE (básico)
      if (action === "type") {
        content += `    cy.get('input').type('test');\n`;
        hasAnyStep = true;
      }

      // 👉 CLICK (básico)
      if (action === "click") {
        content += `    cy.get('button').click();\n`;
        hasAnyStep = true;
      }

    });

    // 🔥 fallback: nunca deixa vazio
    if (!hasAnyStep) {
      content += `    cy.log('No valid actions detected');\n`;
    }

    content += `
  });
`;
  });

  content += `
});
`;

  fs.writeFileSync(
    "cypress/e2e/tests/auto-generated-e2e.cy.ts",
    content
  );

  console.log("\n✅ E2E TEST GENERATED SUCCESSFULLY\n");
}