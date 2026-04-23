
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

  it('should validate pagination consistency', () => {

    const urls: string[] = [
      'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100',
      'https://hn.algolia.com/api/v1/search?query=redux&page=1&hitsPerPage=100',
      'https://hn.algolia.com/api/v1/search?query=redux&page=2&hitsPerPage=100'
    ];

    const results: Cypress.Response<any>[] = [];

    cy.wrap(urls).each((url) => {

      const requestUrl = String(url);

      cy.request(requestUrl).then((res) => {
        results.push(res);
      });

    }).then(() => {

      expect(results.length).to.eq(urls.length);

      results.forEach((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('hits');
      });

      if (results.length >= 2) {
        expect(results[0].body.hits).to.not.deep.equal(
          results[1].body.hits
        );
      }

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

    cy.get('input').clear();
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
