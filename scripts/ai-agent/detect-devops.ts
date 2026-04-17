import fs from "fs";
import path from "path";

export function detectDevOps() {
    const root = process.cwd();

    // 🔍 CI/CD (GitHub Actions)
    const hasCI = fs.existsSync(
        path.join(root, ".github", "workflows")
    );

    // 🔍 Cypress Cloud
    let hasCloud = false;

    const configPath = path.join(root, "cypress.config.ts");

    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, "utf-8");
        hasCloud = content.includes("projectId");
    }

    return {
        hasCI,
        hasCloud
    };
}