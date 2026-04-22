import fs from "fs";
import path from "path";

type Quality = {
    file: string;
    hasStatusCheck: boolean;
    hasErrorTest: boolean;
    hasPagination: boolean;
    hasSchemaValidation: boolean;
};

export function analyzeTestQuality(): Quality[] {
    const testDir = path.resolve("cypress/e2e");

    if (!fs.existsSync(testDir)) return [];

    const results: Quality[] = [];

    function readFiles(dir: string) {
        const files = fs.readdirSync(dir);

        files.forEach((file) => {
            const fullPath = path.join(dir, file);

            if (fs.statSync(fullPath).isDirectory()) {
                readFiles(fullPath);
            } else if (file.endsWith(".js") || file.endsWith(".ts")) {
                const content = fs.readFileSync(fullPath, "utf-8");

                results.push({
                    file: fullPath,

                    // 🔥 aceita Cypress moderno
                    hasStatusCheck:
                        content.includes("status") &&
                        (content.includes("eq(200)") || content.includes("to.eq(200)")),

                    // 🔥 detecta erro real
                    hasErrorTest:
                        content.includes("failOnStatusCode") ||
                        content.includes("forceNetworkError") ||
                        content.includes("INVALID") ||
                        content.includes("throw new Error"),

                    // 🔥 paginação
                    hasPagination:
                        content.includes("page=") ||
                        content.includes("pagination") ||
                        content.includes("forEach"),

                    // 🔥 valida schema
                    hasSchemaValidation:
                        content.includes("have.property") ||
                        content.includes("body.") ||
                        content.includes("hits"),
                });
            }
        });
    }

    readFiles(testDir);

    return results;
}