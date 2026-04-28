const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: "doark9",

  video: true,
  screenshotOnRunFailure: true,

  retries: {
    runMode: 2,
    openMode: 0
  },

  defaultCommandTimeout: 8000,
  requestTimeout: 10000,

  e2e: {
    baseUrl: 'https://hackernews-seven.vercel.app',

    specPattern: [
  'cypress/e2e/tests/**/*.cy.{js,ts}',
  'cypress/e2e/generated/api/**/*.cy.{js,ts}',
  'cypress/e2e/generated/e2e/**/*.cy.{js,ts}'
],

    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        MAILOSAUR_API_KEY: process.env.MAILOSAUR_API_KEY,
        MAILOSAUR_SERVER_ID: process.env.MAILOSAUR_SERVER_ID
      }

      return config
    }
  }
})