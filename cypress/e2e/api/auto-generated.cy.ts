describe('API Auto Generated Tests', () => {


  it('should improve GET /api/v1/search', () => {
    cy.request({
      method: 'GET',
      url: 'https://hn.algolia.com/api/v1/search?page=1'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('hits');
      expect(response.body.hits.length).to.be.greaterThan(0);
    });
  });
});