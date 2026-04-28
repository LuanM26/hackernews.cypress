// src/analysis/quality/scenario.analyzer.ts

export function analyzeScenarios(tests: any[]) {
  const scenarios: Record<string, any> = {};

  tests.forEach((test) => {
    const content = test.content;

    // detecta endpoint base
    if (!content.includes('search')) return;

    const endpoint = '/search';

    if (!scenarios[endpoint]) {
      scenarios[endpoint] = {
        empty: false,
        negative: false,
        validation: false,
        success: false
      };
    }

    // 🟡 EMPTY INPUT (mais restrito)
    if (
      content.includes("type('{enter}')") ||
      content.includes('query=') ||
      content.includes("clear().type('')")
    ) {
      scenarios[endpoint].empty = true;
    }

    // 🔴 NEGATIVE (REAL)
    if (
      content.includes('failOnStatusCode: false') ||
      content.includes('forceNetworkError')
    ) {
      scenarios[endpoint].negative = true;
    }

    // 🟣 VALIDATION (REAL API)
    if (
      content.includes('response.body') ||
      content.includes('res.body') ||
      content.includes('body.hits')
    ) {
      scenarios[endpoint].validation = true;
    }

    // 🟢 SUCCESS (REAL)
    if (
      content.includes('statusCode') ||
      content.includes('eq(200)')
    ) {
      scenarios[endpoint].success = true;
    }
  });

  return scenarios;
}