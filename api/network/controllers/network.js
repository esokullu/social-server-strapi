'use strict';

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
    }
};
