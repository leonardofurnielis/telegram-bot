'use strict';

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('text', (ctx) => {
  // Explicit usage
  console.log(ctx.message.chat);
  ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.chat.first_name}`);

  // Using context shortcut
  ctx.reply(`Hello ${ctx.message.chat.first_name}`);
})

bot.launch()
