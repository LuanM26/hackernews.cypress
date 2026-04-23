import { Faker } from "@faker-js/faker";

describe('Pagina', () => {

  beforeEach(() => {
    cy.captureRequests();
    cy.visit('/');
    Cypress.on('uncaught:exception', () => false);
  });

  afterEach(() => {
    // espera requisições acontecerem


    cy.get('@capturedRequests').then((newReqs) => {
      cy.readFile('scripts/ai-agent/runtime-requests.json', {
        failOnNonExisting: false,
      }).then((existing) => {
        const safe = Array.isArray(existing) ? existing : [];

        const merged = [...safe, ...newReqs];

        const unique = Array.from(
          new Map(
            merged.map(item => [`${item.method}-${item.url}`, item])
          ).values()
        );

        cy.writeFile('scripts/ai-agent/runtime-requests.json', unique);
      });
    });
  });

  it('You must find the Search element and type something using Faker', () => {
    const { faker } = require('@faker-js/faker');

    cy.intercept('GET', '**/search*').as('searchRequest')

    cy.get('input').should('be.visible');
    cy.get('input').clear().type('' + faker.lorem.word());
    cy.get('form > button').click();
    cy.wait('@searchRequest').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.hits).to.have.length.greaterThan(0);
    });
  });
  it('You must validate the display of network error', () => {

    cy.intercept('GET', '**/search*', {
      forceNetworkError: true
    });

    cy.get('input').should('be.visible');
    cy.get('input').clear().type('hello{enter}')
    cy.contains('Something went wrong.')
      .should('be.visible');
  });
  it('You must change the order when clicking on Title', () => {

    cy.intercept('GET', '**/search*')
      .as('getTopStories')

    let antes = []

    cy.get('.table-row').then(($rows) => {
      antes = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )
    })

    cy.contains('button', 'Title').click()

    cy.get('.table-row').should('have.length.greaterThan', 1)

    cy.get('.table-row').then(($rows) => {

      const depois = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )

      // valida mudança
      expect(depois).to.not.deep.equal(antes)

    })
  })
  it('You must change the order when clicking on Author', () => {

    cy.intercept('GET', '**/search*')
      .as('getTopStories')

    let antes = []

    cy.get('.table-row').then(($rows) => {
      antes = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )
    })

    cy.contains('button', 'Author').click()

    cy.get('.table-row').should('have.length.greaterThan', 1)

    cy.get('.table-row').then(($rows) => {

      const depois = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )

      // valida mudança
      expect(depois).to.not.deep.equal(antes)

    })
  })
  it('You must change the order when clicking on Comments', () => {

    cy.intercept('GET', '**/search*')
      .as('getTopStories')

    let antes = []

    cy.get('.table-row').then(($rows) => {
      antes = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )
    })

    cy.contains('button', 'Comments').click()

    cy.get('.table-row').should('have.length.greaterThan', 1)

    cy.get('.table-row').then(($rows) => {

      const depois = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )

      // valida mudança
      expect(depois).to.not.deep.equal(antes)

    })
  })
  it('You must change the order when clicking on Points', () => {

    cy.intercept('GET', '**/search*')
      .as('getTopStories')

    let antes = []

    cy.get('.table-row').then(($rows) => {
      antes = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )
    })
    Cypress._.times(2, () => {
      cy.contains('button', 'Points').click()
    })

    cy.get('.table-row').should('have.length.greaterThan', 1)

    cy.get('.table-row').then(($rows) => {

      const depois = [...$rows].map(row =>
        row.querySelector('a').innerText.trim()
      )

      // valida mudança
      expect(depois).to.not.deep.equal(antes)

    })
  })
  it('You must delete an item from the list by clicking on Archive', () => {
    cy.intercept('GET', '**/search*')
      .as('getTopStories')

    cy.get('.table > :nth-child(2)').should('be.visible').as('primeiraLinha')
    cy.get('@primeiraLinha').find('a').invoke('text').then((tituloPrimeiraLinha) => {
      cy.get('@primeiraLinha').contains('button', 'Dismiss').click()
      cy.get('.table > :nth-child(2)').should('be.visible').find('a').invoke('text').should((tituloSegundaLinha) => {
        expect(tituloSegundaLinha).to.not.equal(tituloPrimeiraLinha)
      })
    })
  })
  it('You must find the More button and click it to load more items', () => {
    cy.intercept('GET', '**/search*')
      .as('getTopStories')

    Cypress._.times(2, () => {
      cy.get('.page > :nth-child(3) > button').click()
    })
    cy.wait('@getTopStories').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.hits).to.have.length.greaterThan(0);
      cy.get('.table-row a').then(($elements) => {
        cy.log(`Quantidade de itens: ${$elements.length}`)
      })
    });
  });
  it('You must validate multiple items via fixture', () => {
    cy.validateTopNLinks('.table-row a', 5)
  })
});