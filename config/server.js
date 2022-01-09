module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 80),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '4764a9c0c21fc0698b0b475318827265'),
    },
  },
});
