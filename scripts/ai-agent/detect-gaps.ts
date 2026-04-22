type Inputs = {
    insights: any;
    coverage: any[];
    quality: any[];
};

export function detectGaps({ insights, coverage, quality }: Inputs) {
    return {
        missingEmptySearch: !insights.hasAssertion,

        missingErrorHandling: !quality.some(q => q.hasErrorTest),

        missingPagination: !quality.some(q => q.hasPagination),

        missingStatusCheck: !quality.some(q => q.hasStatusCheck),

        uncoveredEndpoints: coverage.filter(c => !c.covered)
    };
}