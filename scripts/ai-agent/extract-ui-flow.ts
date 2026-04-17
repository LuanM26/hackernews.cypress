import { readProject } from "./read-project";

type UIFlow = {
    file: string;
    actions: string[];
};

export function extractUIFlows(): UIFlow[] {
    const tests = readProject();

    return tests.map((test) => {
        const actions: string[] = [];
        const lines = test.content.split("\n");

        lines.forEach((line) => {
            const trimmed = line.trim();

            // 👉 VISIT
            if (trimmed.includes("cy.visit")) {
                const match = trimmed.match(/cy\.visit\((.*?)\)/);
                if (match && match[1]) {
                    actions.push(`visit ${match[1]}`);
                }
            }

            // 👉 GET
            if (trimmed.includes("cy.get")) {
                const match = trimmed.match(/cy\.get\((.*?)\)/);

                if (match && match[1]) {
                    const selector = match[1];

                    // ❌ ignora aliases (@algo)
                    if (selector.includes("@")) return;

                    actions.push(`get ${selector}`);
                }
            }
            // 👉 CLICK
            if (trimmed.includes(".click(")) {
                actions.push("click");
            }

            // 👉 TYPE
            if (trimmed.includes(".type(")) {
                actions.push("type");
            }
        });

        // 🔥 REMOVE DUPLICADOS + GARANTE ARRAY LIMPO
        const uniqueActions = Array.from(new Set(actions));

        return {
            file: test.path,
            actions: uniqueActions,
        };
    });
}