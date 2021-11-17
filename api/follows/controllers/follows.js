'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async follow(ctx) {
    try {
      const query = ctx.request.query
      if(Object.keys(query).length === 0) {
        ctx.send({
          success: false,
          reason: "No field to set"
        })
      }
      if(query.id === ctx.req.user.id) {
        ctx.send({
          success: false,
          reason: "Follower and followee can't be the same"
        })
      }
      const user = await strapi.query('user', 'users-permissions').findOne({
        id: query.id
      })
      if(!user) {
        return ctx.send({
          success: false,
          reason: "Invalid user ID"
        })
      }
      const follow = await strapi.services.follows.findOne({
        following: query.id,
        follower: ctx.req.user.id
      })
      const sanitizedFollow = sanitizeEntity(follow, {
        model: strapi.models["follows"]
      })
      if(sanitizedFollow) {
        return ctx.send({
          success: false,
          reason: "already follow"
        });
      }
      await strapi.services.follows.create({
        following: query.id,
        follower: ctx.req.user.id
      })
      return ctx.send({
        success: true,
      });
    } catch (error) {
      ctx.send({
        success: false,
        reason: "Internal Error."
      });
    }
  }
};
