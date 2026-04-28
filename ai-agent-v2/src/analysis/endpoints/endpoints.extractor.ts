// src/analysis/endpoints/endpoints.extractor.ts

import { normalizeEndpoint } from '../../utils/endpoint.utils';

export function extractEndpoints(tests: any[]) {
  const endpoints = new Set<string>();

  tests.forEach((test) => {
    const content = test.content;

    // =========================
    // 1. url: '...'
    // =========================
    const urlMatches = content.match(/url:\s*['"`](.*?)['"`]/g);
    if (urlMatches) {
      urlMatches.forEach((match: string) => {
        const url = match.split(/['"`]/)[1];
        endpoints.add(url);
      });
    }

    // =========================
    // 2. cy.request('...')
    // =========================
    const requestMatches = content.match(/cy\.request\(\s*['"`](.*?)['"`]\s*\)/g);
    if (requestMatches) {
      requestMatches.forEach((match: string) => {
        const url = match.match(/['"`](.*?)['"`]/)?.[1];
        if (url) endpoints.add(url);
      });
    }

    // =========================
    // 3. cy.request({ url: '...' })
    // =========================
    const objectRequestMatches = content.match(/cy\.request\(\s*{([\s\S]*?)}\s*\)/g);
    if (objectRequestMatches) {
      objectRequestMatches.forEach((block: string) => {
        const urlMatch = block.match(/url:\s*['"`](.*?)['"`]/);
        if (urlMatch) endpoints.add(urlMatch[1]);
      });
    }

    // =========================
    // 4. 🔥 cy.intercept(...)
    // =========================
    const interceptMatches = content.match(/cy\.intercept\(\s*['"`](GET|POST|PUT|DELETE)['"`]\s*,\s*['"`](.*?)['"`]/g);

    if (interceptMatches) {
      interceptMatches.forEach((match: string) => {
        const parts = match.match(/['"`](GET|POST|PUT|DELETE)['"`]\s*,\s*['"`](.*?)['"`]/);
        
        if (parts) {
          const method = parts[1];
          const url = parts[2];

          endpoints.add(`${method} ${url}`);
        }
      });
    }
  });

  const normalized = Array.from(endpoints).map(normalizeEndpoint);

  // remove duplicados após normalização
  return [...new Set(normalized)];
}