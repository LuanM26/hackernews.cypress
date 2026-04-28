// src/analysis/gaps/gaps.detector.ts

export function detectGaps(endpoints: string[], scenarios: any) {
  const gaps: any[] = [];

  endpoints.forEach((endpoint) => {
    // normaliza endpoint
    const base = endpoint.includes('search') ? '/search' : endpoint;

    const scenario = scenarios[base];

    if (!scenario) {
      gaps.push({
        endpoint,
        missing: ['all scenarios']
      });
      return;
    }

    const missing: string[] = [];

    if (!scenario.empty) missing.push('empty input');
    if (!scenario.negative) missing.push('negative test');
    if (!scenario.validation) missing.push('response validation');
    if (!scenario.success) missing.push('success test');

    if (missing.length > 0) {
      gaps.push({
        endpoint,
        missing
      });
    }
  });

  return gaps;
}