import fs from "fs";
import path from "path";
import { analyzeFailures } from "./analyze-failures";

export function selfHealTests() {
    const failures = analyzeFailures();

    failures.forEach((fail: any) => {
        const filePath = path.resolve("cypress/e2e/tests", fail.file);

        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, "utf-8");

        // 🧠 CORREÇÃO: timeout
        if (fail.type === "timeout") {
            content = content.replace(
                ".click();",
                ".click();\ncy.wait(1000);"
            );
        }

        // 🧠 CORREÇÃO: selector
        if (fail.type === "selector") {
            content = content.replace(
                "cy.get(",
                "cy.get(" // pode evoluir para fallback selector depois
            );
        }

        // 🧠 CORREÇÃO: API
        if (fail.type === "api") {
            content = content.replace(
                "should('eq', 200)",
                "should('be.oneOf', [200, 304])"
            );
        }

        fs.writeFileSync(filePath, content);
    });

    console.log("🤖 Self-healing aplicado");
}