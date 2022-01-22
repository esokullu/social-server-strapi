'use strict';

const { create } = require("lodash");
const { v4: uuidv4 } = require('uuid');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async getCustomFields(ctx) {
        ctx.send({
            success: true,
            custom_field1: "",
            custom_field2:	"",
            custom_field3:	"",
            custom_field1_must:	"",
            custom_field2_must:	"",
            custom_field3_must:	"",
        });
    },

    async createNetwork(ctx) {
        const pass = "some_rally rand0 sh1t";
        const query = ctx.query;
        console.log(pass)
        try {
            if(!query.pass||query.pass!=pass) {
                ctx.send({
                    success: false,
                    reason: "Not allowed (1)"
                  });
            }
            const public_id = uuidv4()
              const network = await strapi.services.network.create({
                title: query.title,
                custom_domain: '',
                creator: query.creator,
                public_id: public_id,
                slug: query.slug
              })
              ctx.send({
                success: true,
                public_id: public_id
              });
              console.log('and him')
          } catch (error) {
            // try to fetch the POST query
            ctx.send({
              success: false,
              reason: "Not allowed (3)"
            });
          }
    }
};
