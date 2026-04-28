// src/analysis/coverage/coverage.analyzer.ts

export function analyzeCoverage(endpoints: string[]) {
  return {
    total: endpoints.length,
    covered: endpoints,
    missing: [] // vamos evoluir depois
  };
}