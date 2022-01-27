'use strict';

const { create } = require("lodash");
const { v4: uuidv4 } = require('uuid');
const { exec } = require("child_process");
const escapeshellarg = require('escapeshellarg')


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

              const api_host = "https://groups.land/v1";
              // cd frontend
              // bin/generate name Title --id `uuidgen` --host '/v1/'    
              // mv dist/name ../public
              exec("pwd", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
              });
              let cmd = "cd frontend && bin/generate "
                + escapeshellarg(query.slug) + " " + escapeshellarg(query.title) 
                + " --id " + escapeshellarg(public_id) 
                + "--host " + escapeshellarg(api_host)
                + " && mv " + escapeshellarg("dist/"+query.slug) + "../public";
              console.log(cmd);
              exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
              });

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
