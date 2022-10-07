'use strict';

const { Telegraf } = require('telegraf');
const NodeCache = require('node-cache');
const watsonAssistant = require('./watson-assistant');
const nlu = require('./watson-nlu');

const localCache = new NodeCache();

function MessageBroker(message) {
  return new Promise(async (resolve, reject) => {
    try {
      const chatId = message.chat.id;

      const fullContext = localCache.get(chatId) || {
        skills: { 'main skill': { user_defined: {} } },
      };
      const context = fullContext.skills['main skill'].user_defined;

      const nluResponse = await nlu.analyze({ text: message.text });

      context.sentiment = nluResponse.sentiment.document.label;

      context.first_name = message.chat.first_name;
      console.debug('User sentiment >>>', nluResponse.sentiment.document.label);

      fullContext.skills['main skill'].user_defined = context;
      const watsonResponse = await watsonAssistant.message({
        text: message.text,
        id: chatId,
        context: fullContext,
      });
      console.debug('Watson Assistant output >>>', watsonResponse.output.generic);

      localCache.set(chatId, watsonResponse.context);

      resolve(watsonResponse.output.generic);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  start: () => {
    try {
      const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
      telegramBot.start((ctx) => ctx.reply(`Welcome ${ctx.message.chat.first_name}`));

      telegramBot.on('text', async (ctx) => {
        // Using context shortcut
        const response = await MessageBroker(ctx.message);

        response.forEach((element) => {
          if (element.response_type === 'text') {
            ctx.reply(element.text);
          }
        });
      });

      telegramBot.launch();
    } catch (err) {
      console.error(err);
    }
  },
};
