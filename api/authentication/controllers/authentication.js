'use strict';
const axios = require('axios');
//const request = require('strapi-helper-plugin').request;
//{ auth, LoadingIndicatorPage, request } from 'strapi-helper-plugin';
module.exports = {
    // GET /hello
    async whoami(ctx) {
        const requestUrl = 'http://localhost:1337/auth/local';
        const { data } = await axios.post(requestUrl, {
            identifier: 'reader@strapi.io',
            password: 'strapi',
          });


          /*

          axios.post('http://localhost:1337/auth/local', {
    identifier: 'emre@groups-inc.com',
    password: '...',
  }).then(response => {
    // Handle success.
    console.log('Well done!');
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);
  }).catch(error => {
    // Handle error.
    console.log('An error occurred:', error.response);
  });

          User profile {
  id: 1,
  username: 'emre',
  email: 'emre@groups-inc.com',
  provider: 'local',
  confirmed: false,
  blocked: false,
  role: {
    id: 1,
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'authenticated'
  },
  created_at: '2021-10-28T15:30:53.516Z',
  updated_at: '2021-10-28T15:30:53.528Z'
}
User token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjM1NDM1MTI2LCJleHAiOjE2MzgwMjcxMjZ9.1IwYkEPsk5fMZRpClZCByjDUKgy5UBhu9Io45v-mFsM

          */
        
  
  console.log(data);

        if(ctx.state.user) {
            ctx.send(
                {
                    success: true,/*
                    id	"4626d0f17263f8bc3482d0150be122ee"
admin	true
username	"admin"
editor	true
pending	false*/
                }
            );    
            return;  
        }
        
        //ctx.send({success: false, reason: "No active session"});    
        if(ctx.session.isNew) {
            ctx.session.emre="Emel";
            return "not logged in";
        }
        else {
            return "is logged in: "+ctx.session.emre;
        }
        //return "Hello World!";
    },

    async login(ctx) {
        //console.log('>>' , strapi.backendURL);
        console.log('Emre:', ctx.request.get("username"));
        console.log('Sokullu:', ctx.request.get("password"));
        console.log('Sokullu:', ctx.request.query);
        axios.post('http://localhost:1337/auth/local', {
    identifier: ctx.request.query.username,
    password: ctx.request.query.password
  }).then(response => {
    // Handle success.
    console.log('Well done!');
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);
  }).catch(error => {
    // Handle error.
    console.log('An error occurred:', error.response);
  });
  return " logged in";
    }
};