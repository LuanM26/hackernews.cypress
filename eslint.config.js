import js from '@eslint/js'
import globals from 'globals'
import pluginCypress from 'eslint-plugin-cypress'

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      cypress: pluginCypress
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'cypress/no-unnecessary-waiting': 'error'
    }
  }
]