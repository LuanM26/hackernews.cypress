Cypress.Commands.add('validateTopNLinks', (selector, limit = 5) => {

    cy.get(selector)
        .should('have.length.greaterThan', 0)
        .then(($elements) => {

            const items = [...$elements].slice(0, limit)

            items.forEach((el, index) => {

                const text = el.innerText.trim()
                const url = el.href

                cy.log(`Item ${index + 1}: ${text}`)

                expect(url, `URL do item ${index + 1}`)
                    .to.match(/^https?:\/\//)

            })

        })

})