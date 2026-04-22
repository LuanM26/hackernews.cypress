import fs from "fs";
import path from "path";

type E2EInsights = {
    hasSearch: boolean;
    hasClick: boolean;
    hasNavigation: boolean;
    hasAssertion: boolean;
    selectors: string[];
};

export function readExistingE2E(): E2EInsights {
    const filePath = path.resolve(
        "cypress/e2e/tests/pagina.cy.js"
    );

    if (!fs.existsSync(filePath)) {
        return {
            hasSearch: false,
            hasClick: false,
            hasNavigation: false,
            hasAssertion: false,
            selectors: []
        };
    }

    const content = fs.readFileSync(filePath, "utf-8");

    const selectors =
        content.match(/cy\.get\(['"`](.*?)['"`]\)/g)?.map(s =>
            s.replace(/cy\.get\(['"`](.*?)['"`]\)/, "$1")
        ) || [];

    return {
        hasSearch: content.includes("type("),
        hasClick: content.includes("click("),
        hasNavigation: content.includes("visit("),
        hasAssertion: content.includes("should("),
        selectors
    };
}