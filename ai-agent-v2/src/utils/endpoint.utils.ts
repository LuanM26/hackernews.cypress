// src/utils/endpoint.utils.ts

export function normalizeEndpoint(endpoint: string): string {
  // remove método (GET, POST...)
  let normalized = endpoint.replace(/^(GET|POST|PUT|DELETE)\s+/, '');

  // remove wildcard
  normalized = normalized.replace(/\*\*/g, '');

  // remove query params
  normalized = normalized.split('?')[0];

  // remove trailing *
  normalized = normalized.replace(/\*/g, '');

  return normalized.trim();
}