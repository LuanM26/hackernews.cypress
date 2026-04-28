// src/intelligence/qa.score.ts

export function calculateQAScore(scenarios: Record<string, any>) {
  let totalChecks = 0;
  let passedChecks = 0;

  const details: any = {};

  Object.entries(scenarios).forEach(([endpoint, checks]) => {
    const result = {
      success: checks.success,
      validation: checks.validation,
      negative: checks.negative,
      empty: checks.empty
    };

    details[endpoint] = result;

    Object.values(result).forEach((value) => {
      totalChecks++;
      if (value) passedChecks++;
    });
  });

  const score = totalChecks === 0 ? 0 : Math.round((passedChecks / totalChecks) * 100);

  return {
    score,
    totalChecks,
    passedChecks,
    details
  };
}