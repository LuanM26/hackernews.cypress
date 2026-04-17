export function deduplicateFlows(flows: string[]): string[] {
    const unique = new Set<string>();

    return flows.filter(flow => {
        const normalized = flow.replace(/\s+/g, "").toLowerCase();

        if (unique.has(normalized)) return false;

        unique.add(normalized);
        return true;
    });
}