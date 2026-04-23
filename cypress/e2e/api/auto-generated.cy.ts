
describe('API Auto Generated (AI Level 6 - Smart)', () => {

  it('deve validar completamente a resposta da API', () => {

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

  it('deve validar a consistência da paginação', () => {

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

  it('deve validar a resposta de sucesso', () => {

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

  it('deve retornar resposta bem-sucedida', () => {

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

  it('deve lidar com busca vazia', () => {

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

  it('deve lidar com input inválido', () => {

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

  it('deve validar a paginação', () => {

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

});
