import '@cypress/grep'
import 'cypress-iframe'
import './commands'

// comando customizado
Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-cy=${selector}]`)
})

Cypress.on('uncaught:exception', () => false);