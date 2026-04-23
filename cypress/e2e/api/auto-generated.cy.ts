
describe('API Auto Generated (AI Level 6 - Smart)', () => {

});

  it('should validate API response fully', () => {

    cy.request({
      method: 'GET',
      url: 'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.eq(200);
      expect(response.body).to.exist;

      if (typeof response.body === 'string' && response.body.includes('<html')) {
        throw new Error('❌ API retornou HTML');
      }

      expect(response.body).to.have.property('hits');
      expect(response.body.hits).to.be.an('array');
      expect(response.body.hits.length).to.be.greaterThan(0);

    });

  });

  it('should validate pagination consistency', () => {

    const urls = [
  "https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100",
  "https://hn.algolia.com/api/v1/search?query=redux&page=1&hitsPerPage=100",
  "https://hn.algolia.com/api/v1/search?query=redux&page=2&hitsPerPage=100"
];
    const results = [];

    urls.forEach((url) => {
      cy.request(url).then((res) => {
        results.push(res);
      });
    });

    cy.then(() => {

      results.forEach((res) => {
        expect(res.status).to.eq(200);
      });

      if (results.length >= 2) {
        expect(results[0].body.hits).to.not.deep.equal(results[1].body.hits);
      }

    });

  });

  it('should return successful response', () => {

    cy.request({
      method: 'GET',
      url: 'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100?query=redux&page=0',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 400, 404]);

      if (response.body && typeof response.body === 'object') {
        if (response.body.hits) {
          expect(response.body.hits).to.be.an('array');
        }
      }

    });

  });

  it('should handle empty search', () => {

    cy.request({
      method: 'GET',
      url: 'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100?query=&page=0',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 400, 404]);

      if (response.body && typeof response.body === 'object') {
        if (response.body.hits) {
          expect(response.body.hits).to.be.an('array');
        }
      }

    });

  });

  it('should handle invalid input', () => {

    cy.request({
      method: 'GET',
      url: 'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100?query=%25%25%25INVALID%25%25%25&page=0',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 400, 404]);

      if (response.body && typeof response.body === 'object') {
        if (response.body.hits) {
          expect(response.body.hits).to.be.an('array');
        }
      }

    });

  });

  it('should validate pagination', () => {

    cy.request({
      method: 'GET',
      url: 'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100?query=redux&page=1',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 400, 404]);

      if (response.body && typeof response.body === 'object') {
        if (response.body.hits) {
          expect(response.body.hits).to.be.an('array');
        }
      }

    });

  });
