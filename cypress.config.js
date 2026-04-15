const { defineConfig } = require('cypress')
// const grep = require('@cypress/grep/src/plugin')

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

    setupNodeEvents(on, config) {
      // grep(config)

      config.env = {
        ...config.env,
        MAILOSAUR_API_KEY: process.env.MAILOSAUR_API_KEY,
        MAILOSAUR_SERVER_ID: process.env.MAILOSAUR_SERVER_ID
      }

      return config
    }
  }
})