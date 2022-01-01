'use strict';

const { default: createStrapi } = require('strapi');
const { sanitizeEntity } = require('strapi-utils');
const { profileHelper } = require('../../../helpers/user');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async setProfile(ctx) {
    try {
      const query = ctx.request.query
      if(Object.keys(query).length === 0) {
        ctx.send({
          success: false,
          reason: "No field to set"
        })
      }
      let profile = await strapi.services.profiles.findOne({
        user: ctx.req.user.id,
        public_id: query.public_id ? query.public_id : ''
      })

      if(!profile) {
        profile = await strapi.services.profiles.create({
          ...query,
          user: ctx.req.user.id,
          public_id: query.public_id ? query.public_id : ''
        })
      } else {
        profile = await strapi.services.profiles.update({
          user: ctx.req.user.id,
          public_id: query.public_id ? query.public_id : ''
        }, {
          about: query.about,
        })
      }
      ctx.send({
        success: true,
        message: `Following fields set successfully: ${Object.keys(query).map(item => item)}`
    })
    } catch (error) {
      ctx.send({
        success: false,
        reason: "Internal Error."
      });
    }
  },

  async getProfile(ctx) {
    try {
      const query = ctx.request.query
      if(!query.id) {
        return ctx.send({
          success: false,
          reason: "Invalid user ID"
        })
      }
      const profile = await strapi.services.profiles.findOne({
        user: query.id,
        public_id: query.public_id ? query.public_id : ''
      })
      if(!profile) {
        return ctx.send({
          success: false,
          reason: "Invalid user ID"
        })
      }
      const sanitizedProfile = sanitizeEntity(profile, {
        model: strapi.models["profiles"],
      })
      ctx.send({
        success: true,
        profile: profileHelper(sanitizedProfile)
      })
    } catch (error) {
      ctx.send({
        success: false,
        reason: "Internal Error."
      });
    }
    
  }
};
