
describe('undefined - generated E2E', () => {

  it('should execute user flow', () => {

    cy.visit('/');

    cy.get('input').type('test{enter}');

    cy.get('.table-row')
      .should('have.length.greaterThan', 0);

  });

});
