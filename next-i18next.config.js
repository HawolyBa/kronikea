const path = require('path')

module.exports = {
  i18n: {
    locales: ['en', 'fr'],
    fallbackLng: ['en', 'fr'],
    defaultLocale: 'en',
  },
  localePath: typeof window === 'undefined' ? path.resolve('public', 'locales') : '/public/locales',
}