export function fixSelector(selector: string): string {
    let fixed = selector.trim();

    // corrige :nth-child quebrado
    if (fixed.includes(":nth-child(") && !fixed.includes(")")) {
        fixed += ")";
    }

    return fixed;
}

export function enhanceSelector(selector: string): string {
    // fallback inteligente
    if (selector === "input") {
        return "input, [data-testid='search'], input[type='text']";
    }

    if (selector.includes(".table-row")) {
        return ".table-row, [data-testid='row']";
    }

    return selector;
}