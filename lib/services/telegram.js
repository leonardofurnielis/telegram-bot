'use strict';

const { Telegraf } = require('telegraf');
const NodeCache = require('node-cache');
const watson_assistant = require('./watson-assistant');
const nlu = require('./watson-nlu');

const local_cache = new NodeCache();

function message_broker(message) {
  return new Promise(async (resolve, reject) => {
    try {
      const chat_id = message.chat.id;

      const context = local_cache.get(chat_id) || {};

      const nlu_response = await nlu.analyze({ text: message.text });

      context.sentiment = nlu_response.sentiment.document.label;
      console.log(message.chat.first_name);
      context.first_name = message.chat.first_name;
      console.debug('sentiment:', nlu_response.sentiment.document.label);

      const watson_response = await watson_assistant.message({
        text: message.text,
        id: chat_id,
        context,
      });

      console.debug('watson assistant output:', watson_response.output.generic);
      local_cache.set(chat_id, watson_response.output);
      resolve(watson_response.output.generic);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  listen: () => {
    try {
      const telegram_bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

      telegram_bot.start((ctx) => ctx.reply('Welcome'));

      telegram_bot.on('text', async (ctx) => {
        // Using context shortcut
        const response = await message_broker(ctx.message);

        response.forEach((element) => {
          if (element.response_type === 'text') {
            ctx.reply(element.text);
          }
        });
      });

      telegram_bot.launch();
    } catch (err) {
      console.error(err);
    }
  },
};
