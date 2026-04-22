import fs from "fs";
import path from "path";

type TestInsights = {
    hasHappyPath: boolean;
    hasError: boolean;
    hasPagination: boolean;
    hasEmpty: boolean;
    hasFilterVariation: boolean;
};

export function analyzeExistingTests(): TestInsights {
    const filePath = path.resolve("cypress/e2e/api/auto-generated.cy.ts");

    if (!fs.existsSync(filePath)) {
        return {
            hasHappyPath: false,
            hasError: false,
            hasPagination: false,
            hasEmpty: false,
            hasFilterVariation: false
        };
    }

    const content = fs.readFileSync(filePath, "utf-8");

    return {
        hasHappyPath: content.includes("should return valid results"),
        hasError: content.includes("HTML error"),
        hasPagination: content.includes("pagination"),
        hasEmpty: content.includes("empty results"),
        hasFilterVariation: content.includes("different results")
    };
}