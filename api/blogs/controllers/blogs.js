'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const validator = require('validator');
const { sanitizeEntity } = require("strapi-utils");
const koaBody = require('koa-body');
let { toTimestamp } = require('../../../helpers/time')

module.exports = {
  async startBlogPost(ctx) {
    //console.log(":rocket: ~ file: blogs.js ~ line 17 ~ startBlogPost ~ ctx.request.body", ctx.request.body)
    //console.log(":rocket: ~ file: blogs.js ~ line 17 ~ startBlogPost ~ ctx.request.body.title", ctx.request.body.title)
    try {
      // knowing it's GET or POST method
      const query = ctx.query.title ? ctx.query : ctx.request.body;
      if(validator.isLength(query.title, {min:1, max: 255}) && validator.isLength(query.content, {min:1})) {
        const blog = await strapi.services.blogs.create({
          title: query.title,
          content: query.content,
          author: ctx.req.user.id,
          public_id: ctx.query.public_id ? ctx.query.public_id : '' // ALWAYS GET
        })
        const sanitizedBlog = sanitizeEntity(blog, {
          model: strapi.models["blogs"],
        });
        ctx.send({
          success: true,
          id: sanitizedBlog.id
        });
      } else {
        ctx.send({
          success: false,
          reason: "Title (up to 255 chars) and Content are required."
        });
      }
    } catch (error) {
      // try to fetch the POST query
      ctx.send({
        success: false,
        reason: "Title (up to 255 chars) and Content are required."
      });
    }
  },

  async getBlogPost(ctx) {
    try {
      const query = ctx.query;
      if(validator.isLength(query.id, {min:1})) {
        const blog = await strapi.services.blogs.findOne({
          id: query.id.toString(),
          public_id: query.public_id ? query.public_id : ''
        })
        const sanitizedBlog = sanitizeEntity(blog, {
          model: strapi.models["blogs"],
        });
        ctx.send({
          success: true,
          blog: {
            id: sanitizedBlog.id,
            title: sanitizedBlog.title,
            summary: sanitizedBlog.content,
            author: {
              id: sanitizedBlog.author.id,
              username: sanitizedBlog.author.username,
            },
            start_time: toTimestamp(sanitizedBlog.published_at),
            is_draft: sanitizedBlog.is_draft,
            last_edit: toTimestamp(sanitizedBlog.updated_at),
            publish_time: toTimestamp(sanitizedBlog.published_at)
          }
        });
      } else {
        ctx.send({
          success: false,
          reason: "Title (up to 255 chars) and Content are required."
        });
      }
    } catch (error) {
      ctx.send({
        success: false,
        reason: "Internal Error."
      });
    }
  },

  async removeBlogPost(ctx) {
    try {
      const query = ctx.query;
      if(validator.isLength(query.id, {min:1})) {
        const blog = await strapi.services.blogs.delete({
          id: query.id.toString(),
          public_id: query.public_id ? query.public_id : '',
          _limit: 1 // do not delete more than one
        })
        ctx.send({
          success: true
        });
      } else {
        ctx.send({
          success: false,
          reason: "ID is required."
        });
      }
    } catch (error) {
      ctx.send({
        success: false,
        reason: "Internal Error."
      });
    }
  },

  async getBlogPosts(ctx) {
    try {
      const query = ctx.query;
      const order = !query.order ? "DESC" : query.order.toUpperCase();
      const count = !query.count ? 10 : query.count;
      const offset = !query.offset ? 0 : query.offset;

      const posts = await strapi.services.blogs.find({
        public_id: query.public_id ? query.public_id : '',
        _limit: count, 
        _sort: `created_at:${order}`,
        _start: offset 
      });

      const sanitizedPosts = posts.map(blog => {
        const sanitizedBlog = sanitizeEntity(blog, {
          model: strapi.models["blogs"],
        });
        return {
          id: sanitizedBlog.id,
          title: sanitizedBlog.title,
          summary: sanitizedBlog.content,
          author: {
            id: sanitizedBlog.author.id,
            username: sanitizedBlog.author.username,
          },
          start_time: toTimestamp(sanitizedBlog.published_at),
          is_draft: sanitizedBlog.is_draft,
          last_edit: toTimestamp(sanitizedBlog.updated_at),
          publish_time: toTimestamp(sanitizedBlog.published_at),
          comment_count: sanitizedBlog.comments.length
        }
      })

      ctx.send({
        success: true,
        blogs: sanitizedPosts,
        total: sanitizedPosts.length
      });

    } catch (error) {
      ctx.send({
        success: false,
        reason: "Internal Error."
      });
    }
  },
};
