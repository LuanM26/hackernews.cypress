
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

  const urls: string[] = [
    "https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100",
    "https://hn.algolia.com/api/v1/search?query=redux&page=1&hitsPerPage=100",
    "https://hn.algolia.com/api/v1/search?query=redux&page=2&hitsPerPage=100"
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
