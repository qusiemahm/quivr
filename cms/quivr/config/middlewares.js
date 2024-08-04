module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'quivr-cms.s3.eu-west-3.amazonaws.com',
            '*.strapi.io',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'quivr-cms.s3.eu-west-3.amazonaws.com',
            '*.strapi.io',
          ],
          'style-src': [
            "'self'",
            "'unsafe-inline'",
            'http://localhost:*',
            'https://preview.quivr.app',
            'https://*.vercel.app',
            'https://y040k44.65.21.12.12.sslip.io'
          ],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            '*.intercom.io',
            '*.intercomcdn.com',
            'https://y040k44.65.21.12.12.sslip.io'
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
