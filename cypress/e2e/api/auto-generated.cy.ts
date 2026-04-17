describe('API Auto Generated Tests', () => {


  it('should improve GET /api/v1/search', () => {
    cy.request({
      method: 'GET',
      url: '/api/v1/search?page=1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('hits');
    });
  });

  it('should improve POST /api/v1/search', () => {
    cy.request({
      method: 'POST',
      url: '/api/v1/search',
      body: {
        query: 'example search query'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('hits');
    });
  });
});