type ReportItem = {
    endpoint: string;
    method: string;
    covered: boolean;
    quality?: any;
};

export function generateReport(
    coverage: ReportItem[],
    quality: any[]
): ReportItem[] {

    // ================= MERGE =================

    const report = coverage.map((item) => {
        const match = quality.sort((a, b) => {
            const score = (q: any) =>
                Number(q.hasStatusCheck) +
                Number(q.hasErrorTest) +
                Number(q.hasPagination) +
                Number(q.hasSchemaValidation);

            return score(b) - score(a);
        })[0];


        return {
            endpoint: item.endpoint,
            method: item.method,
            covered: item.covered,
            quality: match,
        };
    });

    // ================= DEDUPLICAÇÃO =================

    const unique = Array.from(
        new Map(
            report.map((item) => [
                `${item.method}-${item.endpoint}`,
                item,
            ])
        ).values()
    );

    return unique;
}