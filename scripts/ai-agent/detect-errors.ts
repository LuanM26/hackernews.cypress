export function detectErrors() {
    return `
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Cannot read properties')) {
    return false;
  }
});
`;
}