import { readProject } from "./read-project";

type UIFlow = {
    file: string;
    actions: string[];
};

// ================= NORMALIZE SELECTOR =================

function normalizeSelector(selector: string) {
    let fixed = selector;

    if (fixed.includes(":nth-child(") && !fixed.match(/\)\s*$/)) {
        fixed += ")";
    }

    fixed = fixed.replace(/''/g, "'");

    return fixed;
}

// ================= CLEAN FLOW (BASE) =================

function cleanFlow(actions: string[]) {
    const result: string[] = [];

    for (let i = 0; i < actions.length; i++) {
        const current = actions[i];
        const prev = result[result.length - 1];

        // ❌ remove duplicado direto
        if (current === prev) continue;

        // ❌ evita type sem get antes
        if (current === "type" && !prev?.startsWith("get")) continue;

        // ❌ evita click sem get antes
        if (current === "click" && !prev?.startsWith("get")) continue;

        // ❌ evita múltiplos clicks seguidos
        if (current === "click" && prev === "click") continue;

        result.push(current);
    }

    return result;
}

// ================= REMOVE CICLOS =================

function removeRepeatedSequences(actions: string[]) {
    const result: string[] = [];

    for (let i = 0; i < actions.length; i++) {
        const current = actions[i];
        const next = actions[i + 1];

        // remove padrão repetido: get X → type duplicado
        if (current.startsWith("get") && next === "type") {
            const lastPair = result.slice(-2);

            if (
                lastPair.length === 2 &&
                lastPair[0] === current &&
                lastPair[1] === "type"
            ) {
                continue;
            }
        }

        result.push(current);
    }

    return result;
}

// ================= MAIN =================

export function extractUIFlows(): UIFlow[] {
    const tests = readProject();

    const ignoredFiles = ["auto-generated", "api"];

    return tests
        .map((test) => {
            const filePath = test.path;

            // 🔥 ignora arquivos gerados
            if (ignoredFiles.some((name) => filePath.includes(name))) {
                return null;
            }

            const actions: string[] = [];
            const lines = test.content.split("\n");

            lines.forEach((line) => {
                const trimmed = line.trim();

                // ================= VISIT =================
                if (trimmed.includes("cy.visit")) {
                    const match = trimmed.match(/cy\.visit\((.*?)\)/);
                    if (match?.[1]) {
                        actions.push(`visit ${match[1]}`);
                    }
                }

                // ================= GET =================
                if (trimmed.includes("cy.get")) {
                    const match = trimmed.match(/cy\.get\((.*?)\)/);

                    if (match?.[1]) {
                        let selector = match[1];

                        if (selector.includes("@")) return;

                        selector = normalizeSelector(selector);

                        actions.push(`get ${selector}`);
                    }
                }

                // ================= TYPE =================
                if (trimmed.includes(".type(")) {
                    actions.push("type");
                }

                // ================= CLICK =================
                if (trimmed.includes(".click(")) {
                    // 🔥 só adiciona click se tiver get antes
                    if (
                        actions.length > 0 &&
                        actions[actions.length - 1].startsWith("get")
                    ) {
                        actions.push("click");
                    }
                }
            });

            // ================= PIPELINE DE LIMPEZA =================

            let cleaned = cleanFlow(actions);

            cleaned = removeRepeatedSequences(cleaned);

            // 🔥 remove duplicados finais (segurança)
            cleaned = Array.from(new Set(cleaned));

            // 🔥 limite de segurança
            const MAX_ACTIONS = 8;
            const finalActions = cleaned.slice(0, MAX_ACTIONS);

            // 🔍 debug (pode remover depois)
            console.log("🧪 CLEANED FLOW:", finalActions);

            return {
                file: filePath,
                actions: finalActions,
            };
        })
        .filter((flow): flow is UIFlow => flow !== null);
}