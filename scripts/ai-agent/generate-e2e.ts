import fs from "fs";
import path from "path";
import { extractUIFlows } from "./extract-ui-flow";
import { fixSelector, enhanceSelector } from "./selector-utils";

// ================= DEDUP =================

function deduplicateFlows(flows: any[]) {
    const seen = new Set<string>();

    return flows.filter((flow) => {
        const key = flow.actions
            .map((a: string) => a.trim().toLowerCase())
            .join("|");

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

// ================= PARSE =================

function parseSelector(action: string): string {
    const raw = action.replace("get ", "").trim();
    return raw.replace(/['"]/g, "");
}

// ================= INTENT =================

function detectIntent(actions: string[]): string {
    if (actions.includes("type") && actions.includes("click")) return "search";
    if (actions.some((a) => a.includes("page"))) return "pagination";
    return "generic";
}

// ================= MAIN =================

export function generateE2ETests() {
    const flows = extractUIFlows();
    const validFlows = deduplicateFlows(flows);

    let content = `import { faker } from '@faker-js/faker';\n\n`;

    content += `describe('E2E Auto Generated (AI Level 5)', () => {\n\n`;

    content += `
  before(() => {
    Cypress.on('uncaught:exception', () => false);
  });\n\n`;

    validFlows.forEach((flow, index) => {
        if (!flow.actions || flow.actions.length === 0) return;

        let lastSelector = "";
        const intent = detectIntent(flow.actions);

        // ================= POSITIVE TEST =================

        content += `  it('should perform ${intent} successfully', () => {\n`;

        content += `    cy.intercept('GET', '**/search*').as('apiCall');\n`;

        flow.actions.forEach((action: string) => {
            if (action.startsWith("visit")) {
                const url = action.replace("visit ", "").replace(/['"]/g, "");
                content += `    cy.visit('${url}');\n`;
            }

            if (action.startsWith("get")) {
                const selector = parseSelector(action);
                const safeSelector = enhanceSelector(fixSelector(selector));

                lastSelector = safeSelector;

                content += `    cy.get('${safeSelector}').should('be.visible');\n`;
            }

            if (action === "type" && lastSelector) {
                content += `    cy.get('${lastSelector}').clear().type(faker.lorem.word());\n`;
            }

            if (action === "click" && lastSelector) {
                content += `    cy.get('${lastSelector}').click({ force: true });\n`;
            }
        });

        // 🔥 valida API automaticamente
        content += `
    cy.wait('@apiCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('hits');
    });
    `;

        content += `  });\n\n`;

        // ================= NEGATIVE TEST =================

        if (intent === "search") {
            content += `  it('should handle ${intent} error', () => {\n`;

            content += `
    cy.intercept('GET', '**/search*', {
      forceNetworkError: true
    });

    cy.visit('/');

    cy.get('input').type('test{enter}');

    cy.contains('Something went wrong').should('be.visible');
`;

            content += `  });\n\n`;
        }
    });

    content += `});`;

    // ================= SAVE =================

    const filePath = path.resolve(
        "cypress/e2e/tests/auto-generated-e2e.cy.ts"
    );

    fs.writeFileSync(filePath, content);

    console.log("🤖 E2E nível 5 (produção real) gerado com sucesso");
}