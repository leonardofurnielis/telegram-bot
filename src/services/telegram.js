'use strict';

const { Telegraf } = require('telegraf');
const NodeCache = require('node-cache');
const watsonAssistant = require('./watson-assistant');

const localCache = new NodeCache();

function TextMessageBroker(message) {
  return new Promise(async (resolve, reject) => {
    try {
      const chatId = message.chat.id;

      const fullContext = localCache.get(chatId) || {
        skills: { 'actions skill': { skill_variables: {} } },
      };
      const context = fullContext.skills['actions skill'].skill_variables;

      context.first_name = message.chat.first_name;

      fullContext.skills['actions skill'].skill_variables = context;
      const res = await watsonAssistant.message({
        text: message.text,
        id: chatId,
        context: fullContext,
      });
      console.debug('**************************');
      console.debug('Session_ID ->', res.context.global.session_id);
      console.debug('Output ->', res.output.generic);
      console.debug('**************************');

      localCache.set(chatId, res.context);

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
      bot.start((ctx) => ctx.reply(`Welcome ${ctx.message.chat.first_name}`));
      
      bot.on('text', async (ctx) => {
        // Using context shortcut
        const response = await TextMessageBroker(ctx.message);

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
