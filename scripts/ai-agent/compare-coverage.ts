import { extractEndpointsFromTests } from "./coverage-analyzer";
import { getApiRequests } from "./filter-runtime";

type Endpoint = {
    method: string;
    url: string;
};

type Coverage = {
    endpoint: string;
    method: string;
    covered: boolean;
};

// ================= NORMALIZAÇÃO =================

function normalize(url: string): string {
    return url
        .replace(/\*\*/g, "")       // remove **
        .replace(/\*/g, "")         // remove *
        .replace(/\?.*$/, "")       // remove query params
        .replace(/https?:\/\/[^/]+/, "") // remove domínio
        .trim();
}

// ================= MATCH INTELIGENTE =================

function isMatch(apiUrl: string, testUrl: string): boolean {
    return (
        apiUrl.includes(testUrl) ||
        testUrl.includes(apiUrl) ||
        apiUrl.endsWith(testUrl) ||
        testUrl.endsWith(apiUrl)
    );
}

// ================= MAIN =================

export function compareCoverage(
    realApis: Endpoint[],
    testEndpoints: Endpoint[]
): Coverage[] {

    const coverage: Coverage[] = realApis.map((api) => {
        const apiUrl = normalize(api.url);

        const covered = testEndpoints.some((test) => {
            const testUrl = normalize(test.url);

            return isMatch(apiUrl, testUrl);
        });

        return {
            endpoint: apiUrl,
            method: api.method,
            covered,
        };
    });

    // ================= DEDUPLICAÇÃO =================

    const uniqueCoverage = Array.from(
        new Map(
            coverage.map((c) => [`${c.method}-${c.endpoint}`, c])
        ).values()
    );

    return uniqueCoverage;
}