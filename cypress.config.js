module.exports = {
  chromeWebSecurity: false,
  video: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://stampinup.com',
  },
};
