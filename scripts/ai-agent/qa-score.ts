type CoverageItem = {
    endpoint: string;
    method: string;
    covered: boolean;
};

type QualityItem = {
    file: string;
    hasStatusCheck: boolean;
    hasErrorTest: boolean;
    hasPagination: boolean;
    hasSchemaValidation: boolean;
};

export function calculateQAScore(
    coverage: CoverageItem[],
    quality: QualityItem[]
) {
    // ------------------------
    // 📊 COVERAGE SCORE
    // ------------------------
    const coveredCount = coverage.filter(c => c.covered).length;
    const coverageScore = coverage.length
        ? (coveredCount / coverage.length) * 100
        : 0;

    // ------------------------
    // 📊 API vs E2E SPLIT
    // ------------------------
    const apiTests = quality.filter(q => q.file.includes("api"));
    const e2eTests = quality.filter(q => q.file.includes("tests"));

    // ------------------------
    // 📊 QUALITY SCORE HELPER
    // ------------------------
    function calcQualityScore(tests: QualityItem[]) {
        if (!tests.length) return 0;

        const totalChecks = tests.length * 4;

        const passedChecks = tests.reduce((acc, test) => {
            return acc +
                (test.hasStatusCheck ? 1 : 0) +
                (test.hasErrorTest ? 1 : 0) +
                (test.hasPagination ? 1 : 0) +
                (test.hasSchemaValidation ? 1 : 0);
        }, 0);

        return (passedChecks / totalChecks) * 100;
    }

    const apiQualityScore = calcQualityScore(apiTests);
    const e2eQualityScore = calcQualityScore(e2eTests);

    // ------------------------
    // 📊 FINAL SCORE
    // ------------------------
    const finalScore =
        (coverageScore * 0.4) +
        (apiQualityScore * 0.3) +
        (e2eQualityScore * 0.3);

    return {
        coverageScore: Math.round(coverageScore),
        apiQualityScore: Math.round(apiQualityScore),
        e2eQualityScore: Math.round(e2eQualityScore),
        finalScore: Math.round(finalScore),
    };
}