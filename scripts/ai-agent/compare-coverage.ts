import { extractEndpointsFromTests } from "./coverage-analyzer";
import { getApiRequests } from "./filter-runtime";

function normalize(url: string) {
    return url
        .replace(/^https?:\/\/[^/]+/, "") // remove domínio
        .split("?")[0]; // remove query params
}
type Endpoint = {
    method: string;
    url: string;
};

export function compareCoverage() {
    const tested: Endpoint[] = extractEndpointsFromTests();
    const runtime: Endpoint[] = getApiRequests();

    const testedPatterns = tested.map(t =>
        t.url.replace("**", "").replace("*", "")
    );

    const results = runtime.map((r) => {
        const normalized = normalize(r.url);

        const isCovered = testedPatterns.some(pattern =>
            normalized.includes(pattern)
        );

        return {
            endpoint: normalized,
            method: r.method,
            covered: isCovered,
        };
    });

    return results;
}