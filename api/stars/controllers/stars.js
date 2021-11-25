'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const validator = require('validator');

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
        ctx.send({
          success: false,
          reason: "Wrong Url format."
        });
      }

      let star = await strapi.services.stars.findOne({
        url: query.url,
        user: ctx.req.user.id,
      })
      if(!star) {
        star = await strapi.services.stars.create({
          url: query.url,
          user: ctx.req.user.id,
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
      ctx.send({
        success: false,
        reason: "Url or ID is required."
      });
    }
  }
};
