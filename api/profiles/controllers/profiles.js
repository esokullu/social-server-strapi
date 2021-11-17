'use strict';

const { default: createStrapi } = require('strapi');
const { sanitizeEntity } = require('strapi-utils');

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
        user: ctx.req.user.id
      })

      if(!profile) {
        profile = await strapi.services.profiles.create({
          ...query,
          user: ctx.req.user.id
        })
      } else {
        profile = await strapi.services.profiles.update({
          user: ctx.req.user.id
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
    const query = ctx.request.query
    if(!query.id) {
      return ctx.send({
        success: false,
        reason: "Invalid user ID"
      })
    }
    const profile = await strapi.services.profiles.findOne({
      user: query.id
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
      profile: {
        username: sanitizedProfile.user.username,
        email: sanitizedProfile.user.email,
        jointime: sanitizedProfile.user.createdAt,
        avatar: sanitizedProfile.avatar,
        birthday: sanitizedProfile.birthday,
        about: sanitizedProfile.about,
        iseditor: false,
        customfield1: sanitizedProfile.customfield1,
        customfield2: sanitizedProfile.customfield2,
        customfield3: sanitizedProfile.customfield3,
        pending: false,
        pendingverification: 0,
        follower_count: sanitizedProfile.user.user_follower ? sanitizedProfile.user.user_follower.length : 0,
        following_count: sanitizedProfile.user.user_following ? sanitizedProfile.user.user_following.length : 0,
        membership_count: 0
      }
    })
  }
};
