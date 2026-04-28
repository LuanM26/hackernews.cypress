// src/utils/test-exists.ts

export function testAlreadyExists(existingTests: any[], endpoint: string) {
  return existingTests.some((test) => {
    return test.content.includes(endpoint);
  });
}