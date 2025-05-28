const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://uphillhealth.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  "viewportHeight": 880,
  "viewportWidth": 1280

});