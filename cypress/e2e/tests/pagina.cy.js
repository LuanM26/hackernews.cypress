describe    ('Pagina', () => {
    it('Deve acessar a página hackernews', () => {
        cy.visit('/');
        cy.intercept('GET', 'https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100')
        .as('getTopStories');
    });
});