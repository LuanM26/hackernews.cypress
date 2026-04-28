
describe('/search - generated tests', () => {

  it('should handle empty input', () => {
    cy.request({
      method: 'GET',
      url: '/search?query=',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 400]);
    });
  });

});
