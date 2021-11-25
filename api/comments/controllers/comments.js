'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const validator = require('validator');

module.exports = {
  async addComment(ctx) {
    const query = ctx.query;
    if(query.url && query.id) {
      ctx.send({
        success: false,
        reason: "Can't use parameter Url and ID together."
      });
    }
    else if(!query.content) {
      ctx.send({
        success: false,
        reason: "Content fields are required."
      });
    }
    else if(query.url) {
      if(!validator.isURL(query.url)){
        return ctx.send({
          success: false,
          reason: "Wrong Url format."
        });
      }
      const comment = await strapi.services.comments.create({
        url: query.url,
        user: ctx.req.user.id,
        content: query.content
      })
      ctx.send({
        success: true,
        comment_id: comment.id
      });
    }
    else if(query.id) {
      const blog = await strapi.services.blogs.findOne({
        id: query.id,
      })
      if(!blog) {
        return ctx.send({
          success: false,
          reason: "Blog doesn't exist."
        });
      }
      const comment = await strapi.services.comments.create({
        blog: query.id,
        user: ctx.req.user.id,
        content: query.content
      })
      ctx.send({
        success: true,
        comment_id: comment.id
      });
    }
    else {
      ctx.send({
        success: false,
        reason: "Url or ID is required."
      });
    }
  }
};
