'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');
const admin = require('../../../helpers/admin');

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
        success: false,
        message: "No active session",
      };
    } else {
      let me = sanitizeUser(user);
      /*
        id	1
        username	"emre"
        email	"emre@groups-inc.com"
        provider	"local"
        confirmed	false
        blocked	false
        role	
        id	1
        name	"Authenticated"
        description	"Default role given to authenticated user."
        type	"authenticated"
        created_at	"2021-10-28T15:30:53.516Z"
        updated_at	"2021-10-28T15:30:53.528Z"
      */
      let public_id = ctx.query.public_id ? ctx.query.public_id : '';
      let isAdmin = await admin(public_id, me.email);

      ctx.body = {
        success: true,
        id: me.id,
        admin: isAdmin,
        username: me.username,
        editor: true,
        pending: false

      };
    }
  },

  /**
   * @description Destroy cookies
   * @param ctx
   */
  async logout(ctx) {
    let public_id = ctx.query.public_id ? ctx.query.public_id : '';
    let token_name = 'token' + public_id;
    ctx.cookies.set(token_name, null);
    ctx.send({
      success: true
    });
  },
};
