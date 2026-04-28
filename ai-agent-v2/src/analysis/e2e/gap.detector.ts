// src/analysis/e2e/gap.detector.ts

export function detectE2EGaps(flows: any) {
  const gaps: any[] = [];

  Object.entries(flows).forEach(([flow, checks]: any) => {
    const missing = [];

    if (!checks.visit) missing.push('missing visit');
    if (!checks.interaction) missing.push('missing interaction');
    if (!checks.assertion) missing.push('missing assertion');

    if (missing.length > 0) {
      gaps.push({ flow, missing });
    }
  });

  return gaps;
}