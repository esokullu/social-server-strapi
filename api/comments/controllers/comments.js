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
  },

  async getComments(ctx) {
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
      const comments = await strapi.services.comments.find({
        url: query.url
      })
      ctx.send({
        success: true,
        comments: comments.map(item=>{
          return {
            [item.id]: {
              content: item.content,
              pending: false,
              createTime: item.created_at,
              author: item.user.id
            }
          }
        })
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
      const comments = await strapi.services.comments.find({
        blog: query.id
      })
      ctx.send({
        success: true,
        comments: comments.map(item=>{
          return {
            [item.id]: {
              content: item.content,
              pending: false,
              createTime: item.created_at,
              author: item.user.id
            }
          }
        })
      });
    }
    else {
      ctx.send({
        success: false,
        reason: "Url or ID is required."
      });
    }
  },

  async editComment(ctx) {
    const query = ctx.query;
    if(!query.content || !query.id) {
      ctx.send({
        success: false,
        reason: "Comment ID and Content are required."
      });
    } else {
      const comment = await strapi.services.comments.findOne({
        id: query.id,
        user: ctx.req.user.id,
      })
      if(!comment){
        return ctx.send({
          success: false,
          reason: "Comment doesn't exist."
        });
      }
      await strapi.services.comments.update({
        id: query.id,
        user: ctx.req.user.id
      },
      {
        content: query.content
      })
      ctx.send({
        success: true
      });
    }
  },

  async removeComment(ctx) {
    const query = ctx.query;
    if(!query.comment_id) {
      ctx.send({
        success: false,
        reason: "Comment ID are required."
      });
    } else {
      const comment = await strapi.services.comments.findOne({
        id: query.comment_id,
        user: ctx.req.user.id,
      })
      if(!comment){
        return ctx.send({
          success: false,
          reason: "Comment doesn't exist."
        });
      }
      await strapi.services.comments.delete({
        id: query.id,
        user: ctx.req.user.id
      })
      ctx.send({
        success: true
      });
    }
  }
};
