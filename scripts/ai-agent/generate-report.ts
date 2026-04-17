import { compareCoverage } from "./compare-coverage";
import { analyzeTestQuality } from "./analyze-test-quality";

export function generateReport() {
    const coverage = compareCoverage();
    const quality = analyzeTestQuality();

    return coverage.map((c) => {
        return {
            endpoint: c.endpoint,
            method: c.method,
            covered: c.covered,
            quality: quality[0], // simplificado por enquanto
        };
    });
}