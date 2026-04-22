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

  it('deve encontrar o elemento de Search e digitar algo do pelo Faker', () => {
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
  it('deve validar a exibição de erro de rede', () => {

    cy.intercept('GET', '**/search*', {
      forceNetworkError: true
    });

    cy.get('input').should('be.visible');
    cy.get('input').clear().type('hello{enter}')
    cy.contains('Something went wrong.')
      .should('be.visible');
  });
  it('deve alterar a ordem ao clicar em Title', () => {

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
  it('deve alterar a ordem ao clicar em Author', () => {

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
  it('deve alterar a ordem ao clicar em Comments', () => {

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
  it('deve alterar a ordem ao clicar em Points', () => {

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
  it('deve excluir um item da lista com clicar em Archive', () => {
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
  it('deve encontrar o botão more e clicar para carregar mais itens', () => {
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
  it('deve validar múltiplos itens via fixture', () => {
    cy.validateTopNLinks('.table-row a', 5)
  })
});