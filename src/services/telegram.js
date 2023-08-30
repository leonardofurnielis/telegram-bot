'use strict';

const { Telegraf } = require('telegraf');
const node_cache = require('node-cache');
const watson_assistant = require('./watson_assistant');

const local_cache = new node_cache();

function text_message_broker(message) {
  return new Promise(async (resolve, reject) => {
    try {
      const chat_id = message.chat.id;

      const full_context = local_cache.get(chat_id) || {
        skills: { 'actions skill': { skill_variables: {} } },
      };
      const context = full_context.skills['actions skill'].skill_variables;

      context.first_name = message.chat.first_name;

      full_context.skills['actions skill'].skill_variables = context;
      const res = await watson_assistant.message({
        text: message.text,
        id: chat_id,
        context: full_context,
      });
      console.debug('**************************');
      console.debug('session_ID ->', res.context.global.session_id);
      console.debug('output ->', res.output.generic);
      console.debug('**************************');

      local_cache.set(chat_id, res.context);

      resolve(res.output.generic);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  start: () => {
    try {
      const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
      bot.start((ctx) => ctx.reply(`Bem-vindo ${ctx.message.chat.first_name}`));

      bot.on('text', async (ctx) => {
        // Using context shortcut
        const response = await text_message_broker(ctx.message);

        response.forEach((element) => {
          if (element.response_type === 'text') {
            ctx.reply(element.text);
          }
        });
      });

      bot.launch();
    } catch (err) {
      console.error(err);
    }
  },
};
