describe('Users API', { tags: ['@api'] }, () => {

  it('GET users', () => {
    cy.request('/users').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.length.greaterThan(0)
    })
  })

  it('POST user', () => {
    const user = {
      name: 'Luan',
      email: 'luan@test.com'
    }

    cy.request('POST', '/users', user).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.name).to.eq(user.name)
    })
  })

  it('PUT user', () => {
    cy.request('PUT', '/users/1', {
      name: 'Updated'
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('DELETE user', () => {
    cy.request('DELETE', '/users/1').then((res) => {
      expect(res.status).to.eq(200)
    })
  })

})