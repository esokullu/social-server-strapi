'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const validator = require('validator');
const { fetch } = require('../../../helpers/api');
const { groupStarred } = require('../../../helpers/content');

module.exports = {
  async star(ctx) {
    const query = ctx.query;
    if(query.url && query.id) {
      ctx.send({
        success: false,
        reason: "Can't use parameter Url and ID together."
      });
    }
    else if(query.url) {
      if(!validator.isURL(query.url)){
        return ctx.send({
          success: false,
          reason: "Wrong Url format."
        });
      }

      let star = await strapi.services.stars.findOne({
        url: query.url,
        user: ctx.req.user.id,
      })
      if(!star) {
        const urlResponse = await fetch(query.url);
        const urlTitle = urlResponse.substring(
          urlResponse.indexOf("<title>") + 7, 
          urlResponse.lastIndexOf("</title>")
        );
      
        star = await strapi.services.stars.create({
          url: query.url,
          user: ctx.req.user.id,
          urlTitle
        })
        const stars = await strapi.services.stars.find({
          url: query.url,
        })
        ctx.send({
          success: true,
          count: stars.length
        });
      } else {
        ctx.send({
          success: false,
          reason: "Already starred."
        });
      }
    }
    else if(query.id) {
      const blog = await strapi.services.blogs.findOne({
        id: query.id.toString(),
      })
      if(!blog) {
        return ctx.send({
          success: false,
          reason: "Blog doesn't exist."
        });
      }
      let star = await strapi.services.stars.findOne({
        blog: query.id,
        user: ctx.req.user.id,
      })
      if(!star) {
        star = await strapi.services.stars.create({
          blog: query.id,
          user: ctx.req.user.id,
        })
        const stars = await strapi.services.stars.find({
          blog: query.id,
        })
        ctx.send({
          success: true,
          count: stars.length
        });
      } else {
        ctx.send({
          success: false,
          reason: "Already starred."
        });
      }
    }
    else {
      ctx.send({
        success: false,
        reason: "Url or ID is required."
      });
    }
  },

  async unstar(ctx) {
    const query = ctx.query;
    if(query.url && query.id) {
      ctx.send({
        success: false,
        reason: "Can't use parameter Url and ID together."
      });
    }
    else if(query.url) {
      if(!validator.isURL(query.url)){
        return ctx.send({
          success: false,
          reason: "Wrong Url format."
        });
      }
      let star = await strapi.services.stars.findOne({
        url: query.url,
        user: ctx.req.user.id,
      })
      if(star) {
        star = await strapi.services.stars.delete({
          url: query.url,
          user: ctx.req.user.id,
        })
        ctx.send({
          success: true,
        });
      } else {
        ctx.send({
          success: false,
          reason: "This Url not starred."
        });
      }
    }
    else if(query.id) {
      const blog = await strapi.services.blogs.findOne({
        id: query.id.toString(),
      })
      if(!blog) {
        return ctx.send({
          success: false,
          reason: "Blog doesn't exist."
        });
      }
      let star = await strapi.services.stars.findOne({
        blog: query.id,
        user: ctx.req.user.id,
      })
      if(star) {
        star = await strapi.services.stars.delete({
          blog: query.id,
          user: ctx.req.user.id,
        })
        ctx.send({
          success: true,
        });
      } else {
        ctx.send({
          success: false,
          reason: "This Blog not starred."
        });
      }
    }
    else {
      ctx.send({
        success: false,
        reason: "Url or ID is required."
      });
    }
  },

  async isStarred(ctx) {
    const query = ctx.query;
    if(query.url && query.id) {
      ctx.send({
        success: false,
        reason: "Can't use parameter Url and ID together."
      });
    }
    else if(query.url) {
      if(!validator.isURL(query.url)){
        return ctx.send({
          success: false,
          reason: "Wrong Url format."
        });
      }
      let stars = await strapi.services.stars.find({
        url: query.url,
      })
      ctx.send({
        success: true,
        count: stars ? stars.length : 0,
        starred: stars ? stars.some(item=>item.user.id === ctx.req.user.id) : false
      });
    }
    else if(query.id) {
      let stars = await strapi.services.stars.find({
        blog: query.id,
      })
      ctx.send({
        success: true,
        count: stars ? stars.length : 0,
        starred: stars ? stars.some(item=>item.user.id === ctx.req.user.id) : false
      });
    }
    else {
      ctx.send({
        success: false,
        reason: "Url or ID is required."
      });
    }
  },

  async getStarredContent(ctx) {
    const stars = await strapi.services.stars.find()
    ctx.send({
      success: true,
      pages: groupStarred(stars)
    });

  },

  async getMyStarredContent(ctx) {
    const stars = await strapi.services.stars.find({
      user: ctx.req.user.id,
    })
    ctx.send({
      success: true,
      pages: groupStarred(stars)
    });

  }
};
