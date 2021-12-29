'use strict';

const { sanitizeEntity } = require('strapi-utils');
const { profileHelper } = require('../../../helpers/user');

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
        id: query.id.toString()
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
      if(follow) {
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
  },

  async unfollow(ctx) {
    try {
      const query = ctx.request.query
      if(Object.keys(query).length === 0) {
        ctx.send({
          success: false,
          reason: "No field to set"
        })
      }
      
      const user = await strapi.query('user', 'users-permissions').findOne({
        id: query.id.toString()
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
      if(!follow) {
        return ctx.send({
          success: false,
          reason: "No follow edge found"
        })
      }

      await strapi.services.follows.delete({
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
  },

  async getFollowing(ctx) {
    const query = ctx.request.query
    if(Object.keys(query).length === 0) {
      ctx.send({
        success: false,
        reason: "No field to set"
      })
    }

    const user = await strapi.query('user', 'users-permissions').findOne({
      id: query.id.toString()
    })
    if(!user) {
      return ctx.send({
        success: false,
        reason: "Invalid user ID"
      })
    }      

    const following = await Promise.all(Object.entries(user.user_followings).map(async ([key, item]) => {
      let profile = await strapi.services.profiles.findOne({
        user: item.following
      })
      let sanitizedProfile = sanitizeEntity(profile, {
        model: strapi.models["profiles"],
      })
      sanitizedProfile = await profileHelper(sanitizedProfile)
      return {
        [`${item.following}`]: sanitizedProfile
      }
    }))

    return ctx.send({
      success: true,
      following
    })
  },

  async getFollowers(ctx) {
    const query = ctx.request.query
    if(Object.keys(query).length === 0) {
      ctx.send({
        success: false,
        reason: "No field to set"
      })
    }

    const user = await strapi.query('user', 'users-permissions').findOne({
      id: query.id.toString()
    })
    if(!user) {
      return ctx.send({
        success: false,
        reason: "Invalid user ID"
      })
    }    

    const followers = await Promise.all(Object.entries(user.user_followers).map(async ([key, item]) => {
      let profile = await strapi.services.profiles.findOne({
        user: item.follower
      })
      let sanitizedProfile = sanitizeEntity(profile, {
        model: strapi.models["profiles"],
      })
      sanitizedProfile = await profileHelper(sanitizedProfile)
      return {
        [`${item.follower}`]: sanitizedProfile
      }
    }))

    return ctx.send({
      success: true,
      followers
    })
  },

  async getMembers(ctx) {
    const users = await strapi.query('user', 'users-permissions').find({
      _limit: -1
    })
    const sanitizedUsers = users.map(item=>{
      const sanitizedUser = sanitizeEntity(item, {
        model: strapi.query('user', 'users-permissions').model,
      });
      return {
          "id": sanitizedUser.id,
          "username": sanitizedUser.username,
          "email": sanitizedUser.email,
          "avatar": sanitizedUser.profile.avatar,
          "is_editor": sanitizedUser.role.name == "editor" ? 1 : 0
      }
    })
    let sanitizedUsers2 = {}
    for(let i in sanitizedUsers) {
      let iid = sanitizedUsers[i].id;
      sanitizedUsers2[iid] = sanitizedUsers[i]
    }
    ctx.send({
      success: true,
      members: sanitizedUsers2
    })
  }
};
