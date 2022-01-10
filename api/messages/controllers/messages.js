'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { groupBy } = require('lodash');
const { toTimestamp } = require('../../../helpers/time')

module.exports = {
  async sendMessage(ctx) {
    const query = ctx.query;
    if(!query.to || !query.message) {
      ctx.send({
        success: false,
        reason: "Valid recipient and message are required."
      });
    }
    else if(query.to == ctx.req.user.id) {
      ctx.send({
        success: false,
        reason: "Can't send a message to self."
      });
    }
    else {
      const receiver = await strapi.query('user', 'users-permissions').findOne({
        id: query.to.toString()
      })
      if(!receiver){
        return ctx.send({
          success: false,
          reason: "Invalid recipient"
        });
      }
      const message = await strapi.services.messages.create({
        from: ctx.req.user.id,
        to: query.to,
        message: query.message,
        public_id: query.public_id ? query.public_id : ''
      })
      if(message.id) {
        ctx.send({
          success: true,
          id: message.uuid
        });
      } else {
        ctx.send({
          success: false,
          id: "Internal error"
        });
      }
    }
  },

  async getInbox(ctx) {
    const response = {};
    const messages = await strapi.services.messages.find({
      to: ctx.req.user.id,
      public_id: query.public_id ? query.public_id : ''
    })
    if(messages) {
      messages.forEach(element => {
        response[element.id] = {
          from: element.from.id,
          message: element.message,
          is_read: element.is_read,
          timestamp: toTimestamp(element.createdAt)
        }
      });
      ctx.send({
        success: true,
        messages: response
      });
    } else {
      ctx.send({
        success: false,
        id: "Internal error"
      });
    }
  },

  async getOutbox(ctx) {
    const response = {};
    const messages = await strapi.services.messages.find({
      from: ctx.req.user.id,
      public_id: query.public_id ? query.public_id : ''
    })
    if(messages) {
      messages.forEach(element => {
        response[element.id] = {
          to: element.to.id,
          message: element.message,
          is_read: element.is_read,
          timestamp: toTimestamp(element.createdAt)
        }
      });
      ctx.send({
        success: true,
        messages: response
      });
    } else {
      ctx.send({
        success: false,
        id: "Internal error"
      });
    }
  },

  async getMessage(ctx) {
    const query = ctx.query;
    if(!query.msgid) {
      ctx.send({
        success: false,
        reason: "Valid message id required"
      });
    } else {
      const message = await strapi.services.messages.findOne({
        id: query.msgid.toString(),
        public_id: query.public_id ? query.public_id : ''
      })
      if(!message) {
        ctx.send({
          success: false,
          reason: "Invalid message ID"
        });
      } else {
        const read = await strapi.services.messages.update({
          id: query.msgid.toString(),
          public_id: query.public_id ? query.public_id : ''
        }, {
          is_read: true
        })
        ctx.send({
          success: true,
          message: {
            to: read.to.id,
            from: read.from.id,
            Content: read.message,
            IsRead: read.is_read,
            SentTime: toTimestamp(read.createdAt)
          }
        })
      }
    }
  },

  async getConversations(ctx) {
    const query = ctx.query;
    console.log(query.public_id);
    console.log(ctx.req.user);
    let response = {};
    const conversations = await strapi.services.messages.find({
          _and: [   
          { 
            _or: [
              {from: ctx.req.user.id},
              {to: ctx.req.user.id}
            ]   
          },
          { public_id: (query.public_id ? query.public_id : '' ) },
        ]
    })
    const groupedConversation = groupBy(conversations, (item) => ctx.req.user.id == item.from.id ? item.to.id : item.from.id)
    Object.entries(groupedConversation).map(([key, item]) => {
      response[key] = {
        id: item[0].id,
        to: item[0].to.id,
        from: item[0].from.id,
        message: item[0].message,
        is_read: item[0].is_read,
        timestamp: toTimestamp(item[0].createdAt)
      }
    });
    ctx.send({
      success: true,
      messages: response
    })
  },

  async getConversation(ctx) {
    let response = {};
    const query = ctx.query;
    if(!query.with) {
      ctx.send({
        success: false,
        reason: "Valid user Id (with) required."
      });
    } else {
      const conversation = await strapi.services.messages.find({
        _where: {
          _and: [
            { public_id: query.public_id ? query.public_id : '' },
            {
              _or: [
                { 
                  from: ctx.req.user.id,
                  to: query.with
                },
                {
                  to: ctx.req.user.id,
                  from: query.with
                }
              ]
            }
          ]
        }
      })
      conversation.forEach(item=>{
        response[item.id] = {
          to: item.to.id,
          from: item.from.id,
          message: item.message,
          is_read: item.is_read,
          timestamp: toTimestamp(item.createdAt)
        }
      })
      ctx.send({
        success: true,
        messages: response
      })
    }
  },

  async reply(ctx) {
    const query = ctx.query;
    if(!query.id || !query.message) {
      ctx.send({
        success: false,
        reason: "Valid recipient and message are required."
      });
    } else {
      const message = await strapi.services.messages.findOne({id: query.id.toString()})
      if(!message) {
        ctx.send({
          success: false,
          reason: "Valid message Id required."
        });
      } else {
        const reply = await strapi.services.messages.create({
          to: message.from.id,
          from: ctx.req.user.id,
          message: query.message,
          public_id: query.public_id ? query.public_id : ''
        })
        ctx.send({
          success: true
        })
      }
    }
  },

  async countUnreadMessages(ctx) {
    const messages = await strapi.services.messages.find({
      to: ctx.req.user.id,
      is_read: true,
      public_id: query.public_id ? query.public_id : ''
    })
    if(messages) {
      ctx.send({
        success: true,
        messages: messages.length
      });
    } else {
      ctx.send({
        success: false,
        id: "Internal error"
      });
    }
  }
};
