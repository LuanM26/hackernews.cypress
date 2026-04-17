import { readProject } from "./read-project";

export function analyzeTestQuality() {
    const tests = readProject();

    return tests.map((test) => {
        const content = test.content;

        return {
            file: test.path,
            hasStatusCheck: content.includes("statusCode"),
            hasErrorTest: content.includes("forceNetworkError"),
            hasPagination: /page=\d+/.test(content),
            hasSchemaValidation: content.includes("body"),
        };
    });
}