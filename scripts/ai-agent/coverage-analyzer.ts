import { readProject } from "./read-project";

export function extractEndpointsFromTests() {
    const tests = readProject();

    const endpoints: { method: string; url: string }[] = [];

    tests.forEach((test) => {
        const regex = /cy\.intercept\(['"`](GET|POST|PUT|DELETE)['"`],\s*['"`]([^'"`]+)['"`]/g;

        let match;

        while ((match = regex.exec(test.content)) !== null) {
            endpoints.push({
                method: match[1],
                url: match[2],
            });
        }
    });

    return endpoints;
}