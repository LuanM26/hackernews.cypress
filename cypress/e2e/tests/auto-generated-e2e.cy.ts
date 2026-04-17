import { faker } from '@faker-js/faker';

describe('E2E Auto Generated (AI Level 5)', () => {


  before(() => {
    Cypress.on('uncaught:exception', () => false);
  });

  it('should perform search successfully', () => {
    cy.intercept('GET', '**/api/v1/search*').as('searchRequest');

    cy.visit('/');

    cy.get('input').should('be.visible');
    cy.get('input').clear().type('redux');

    cy.get('form > button').click();

    cy.wait('@searchRequest').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('hits');
      expect(response.body.hits.length).to.be.greaterThan(0);
    });

    it('should handle search error', () => {

      cy.intercept('GET', '**/search*', {
        forceNetworkError: true
      });

      cy.visit('/');

      cy.get('input').type('test{enter}');

      cy.contains('Something went wrong').should('be.visible');
    });
  });
});