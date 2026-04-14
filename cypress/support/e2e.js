import '@cypress/grep'
import 'cypress-iframe'

// comando customizado
Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-cy=${selector}]`)
})