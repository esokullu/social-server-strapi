'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });


module.exports = {
  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      ctx.body = {
        authorized: false,
        message: "No active session",
      };
    } else {
      ctx.body = sanitizeUser(user);
    }
  },

  /**
   * @description Destroy cookies
   * @param ctx
   */
  async logout(ctx) {
    ctx.cookies.set("token", null);
    ctx.send({
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};
