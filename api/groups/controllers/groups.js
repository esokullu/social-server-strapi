'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async createGroup(ctx) {

        try {
            const query = ctx.query;
            const title = query.title;
            const description = query.description;
      
            const posts = await strapi.services.groups.create({
              
            });
      
      
            ctx.send({
              success: true
            });
      
          } catch (error) {
            ctx.send({
              success: false,
              reason: "Internal Error."
            });
          }

    }

};
