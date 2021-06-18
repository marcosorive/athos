module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'ff5e129835250d67dc2fdc3e68d84fc5'),
    },
  },
  cron: {
    enabled: true
  }
});
