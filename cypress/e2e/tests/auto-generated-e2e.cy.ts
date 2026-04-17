import { faker } from '@faker-js/faker';

describe('E2E Auto Generated (AI Level 5)', () => {


  before(() => {
    Cypress.on('uncaught:exception', () => false);
  });

  it('should perform search successfully', () => {
    cy.intercept('GET', '**/search*').as('apiCall');
    cy.visit('/');
    cy.get('input, [data-testid='search'], input[type='text']').should('be.visible');
    cy.get('input, [data-testid='search'], input[type='text']').clear().type(faker.lorem.word());
    cy.get('form > button').should('be.visible');
    cy.get('form > button').click({ force: true });
    cy.get('.table-row, [data-testid='row']').should('be.visible');
    cy.get('.table > :nth-child(2)').should('be.visible');
    cy.get('.page > :nth-child(3)').should('be.visible');

    cy.wait('@apiCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('hits');
    });
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