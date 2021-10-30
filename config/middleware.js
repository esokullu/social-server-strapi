module.exports = {

  settings: {

    logger: {

      level: process.env.NODE_ENV === "production" ? "info" : "debug",

    },

    session: { enabled: true },

  },

};
