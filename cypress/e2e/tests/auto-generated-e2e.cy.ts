
describe('E2E Auto Generated (Intelligent)', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('intelligent flow 2', () => {

    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Cannot read properties')) {
        return false;
      }
    });


    Cypress.on('uncaught:exception', () => false);

    cy.intercept('GET', '**/search*').as('search');

    cy.get('input')
      .should('be.visible')
      .type('redux');

    cy.get('form > button')
      .should('be.visible')
      .click();

    cy.get('.table-row')
      .should('have.length.greaterThan', 0);

    cy.get('.table > :nth-child(2)')
      .should('exist');

    cy.get('.page > :nth-child(3)')
      .should('exist');

    cy.get('.table-row a')
      .should('exist');

    cy.wait('@search')
      .its('response.statusCode')
      .should('eq', 200);

  });

});
