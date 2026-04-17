export function detectIntent(actions: string[]) {
    if (
        actions.includes("type") &&
        actions.includes("click")
    ) {
        return "search";
    }

    if (actions.some(a => a.includes("page"))) {
        return "pagination";
    }

    return "generic";
}