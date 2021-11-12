'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const validator = require('validator');
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async startBlogPost(ctx) {
    try {
      const query = ctx.query;
      if(validator.isLength(query.title, {min:1, max: 255}) && validator.isLength(query.content, {min:1})) {
        const blog = await strapi.services.blogs.create({
          title: query.title,
          content: query.content
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
      ctx.send({
        success: false,
        reason: "Internal Error."
      });
    }
  }
};
