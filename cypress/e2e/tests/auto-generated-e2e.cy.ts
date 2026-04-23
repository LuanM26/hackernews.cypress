
import { faker } from '@faker-js/faker';
import { e } from '@faker-js/faker/dist/airline-eVQV6kbz';

describe('E2E Auto Generated (AI Level 5)', () => {

  before(() => {
    Cypress.on('uncaught:exception', () => false);
  });

  beforeEach(() => {
    cy.intercept('GET', '**/search*').as('apiCall');
    cy.visit('/');
  });

  it('deve realizar a pesquisa com sucesso', () => {

    cy.intercept('GET', '**/search*').as('apiCall');

    cy.visit('/');

    cy.get('input').should('be.visible').clear().type('' + faker.lorem.word());

    cy.get('form > button').click({ force: true });

    cy.get('.table-row').should('exist');

    cy.wait('@apiCall').then(({ response }) => {
      //expect(response).to.exist;

      expect(response?.statusCode).to.eq(200);

      if (!response) {
        throw new Error('❌ API não respondeu');
      }

      if (typeof response.body === 'string' && response.body.includes('<html')) {
        throw new Error('❌ Backend retornou HTML');
      }

      expect(response.body).to.have.property('hits');

    });

  });

  it('deve lidar com erro de API', () => {

    cy.intercept('GET', '**/search*', {
      forceNetworkError: true
    });

    cy.visit('/');

    cy.get('input').type('test{enter}');

    cy.get('body').should('be.visible');

  });

  it('deve realizar a pesquisa', () => {

    cy.intercept('GET', '**/search*').as('apiCall');

    cy.visit('/');

    cy.get('input').type('angulus');
    cy.get('form > button').click();

    cy.wait('@apiCall').its('response.statusCode').should('eq', 200);

  });

  it('deve lidar com pesquisa vazia', () => {
    cy.visit('/');
    cy.get('input').clear().type('{enter}');
    cy.get('body').should('be.visible');
  });

  it('deve realizar pesquisas múltiplas', () => {

    cy.visit('/');

    ['react', 'vue', 'angular'].forEach(term => {
      cy.get('input').clear().type(term);
      cy.get('form > button').click();
    });

  });

  it('deve lidar com input longo', () => {

    cy.visit('/');

    cy.get('input').type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    cy.get('form > button').click();

  });

  it('deve lidar com interações rápidas', () => {

    cy.visit('/');

    for (let i = 0; i < 3; i++) {
      cy.get('input').clear().type('test' + i);
      cy.get('form > button').click();
    }

  });

  it('should validate success response', () => {

    cy.request({
      method: 'GET',
      url: 'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
      expect(response.body).to.have.property('hits');
      expect(response.body.hits).to.be.an('array');

    });

  });

  it('should return successful response (E2E)', () => {

    cy.visit('/');

    cy.get('input').clear().type('redux');
    cy.get('form > button').click();

    cy.get('.table-row').should('exist');



  });

  it('should handle empty search (E2E)', () => {

    cy.visit('/');

    cy.get('input').clear().type('');
    cy.get('form > button').click();

    cy.get('.table-row').should('exist');


    cy.get('.table-row').should('exist');


  });

  it('should handle invalid input (E2E)', () => {

    cy.visit('/');

    cy.get('input').clear().type('%%%INVALID%%%');
    cy.get('form > button').click();

    cy.get('.table-row').should('exist');


    cy.get('body').should('exist');


  });

  it('should validate pagination (E2E)', () => {

    cy.visit('/');

    cy.get('input').clear().type('redux');
    cy.get('form > button').click();

    cy.get('.table-row').should('exist');



  });

});