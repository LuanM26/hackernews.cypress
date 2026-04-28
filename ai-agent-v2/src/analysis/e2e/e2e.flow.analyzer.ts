// src/analysis/e2e/flow.analyzer.ts

export function analyzeE2EFlows(tests: any[]) {
  const flows: Record<string, any> = {};

  tests.forEach((test) => {
    const content = test.content;

    const hasVisit = content.includes('cy.visit');
    const hasType = content.includes('type(');
    const hasClick = content.includes('click(');
    const hasAssert = content.includes('should');

    const flow = 'default';

    if (!flows[flow]) {
      flows[flow] = {
        visit: false,
        interaction: false,
        assertion: false
      };
    }

    if (hasVisit) flows[flow].visit = true;
    if (hasType || hasClick) flows[flow].interaction = true;
    if (hasAssert) flows[flow].assertion = true;
  });

  return flows;
}