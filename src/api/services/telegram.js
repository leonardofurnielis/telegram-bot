'use strict';

const { Telegraf } = require('telegraf');
const node_cache = require('node-cache');
const axios = require('axios');
const fs = require('fs');
const watson_assistant = require('./watson-assistant');
const watson_stt = require('./watson-stt');
const watson_tts = require('./watson-tts');

const local_cache = new node_cache();

/**
 * Function to handle text messages and interact with a IBM watsonx Assistant.
 * @param {object} message - The message object containing chat information and text.
 * @returns {Promise} - A promise resolving to an array of responses.
 */
function text_message_broker(message) {
  return new Promise(async (resolve, reject) => {
    try {
      const chat_id = message.chat.id;

      // Retrieve or initialize the full context from local cache
      const full_context = local_cache.get(chat_id) || {
        skills: { 'actions skill': { skill_variables: {} } },
      };
      const context = full_context.skills['actions skill'].skill_variables;

      context.first_name = message.chat.first_name;

      // Update the skill_variables in the full context
      full_context.skills['actions skill'].skill_variables = context;

      // Send message to watsonx Assistant with text, chat ID, and full context
      let res = await watson_assistant.message({
        text: message.text,
        id: chat_id,
        context: full_context,
      });

      // Check if watsonx Assistant skip_user_input -> true
      if (
        res.context.global.system.skip_user_input &&
        res.context.global.system.skip_user_input === true
      ) {
        // Store previous output before calling watsonx Assistant again
        const previous_output = res.output.generic;
        console.debug('skip_user_input -> true');

        // Call Watson Assistant without user input
        res = await watson_assistant.message({
          id: chat_id,
          context: res.context,
        });
        console.debug('extension called -> OK');

        // Concatenate previous output with new output
        res.output.generic = previous_output.concat(res.output.generic);
      }

      console.debug('--------------------------------------------------');
      console.debug('assistant session_id ->', res.context.global.session_id);
      console.debug('assistant output ->', res.output.generic);

      // Update local cache with the latest context
      local_cache.set(chat_id, res.context);

      resolve(res.output.generic);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Function to processes voice messages received in a chat context with IBM Watson Speech service.
 * @param {Object} ctx - Context object containing information about the message and Telegram API options.
 * @returns {Promise<Array>} - A promise that resolves with an array of file identifiers representing the synthesized audio responses.
 */
function voice_message_broker(ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // Extract file ID from the incoming voice message
      const file_id = ctx.message.voice.file_id;

      // Construct URL to fetch the voice file using Telegram API
      const get_file_url = `${ctx.telegram.options.apiRoot}/${ctx.telegram.options.apiMode}${ctx.telegram.token}/getFile?file_id=${file_id}`;

      // Fetch the voice file using axios
      const get_file_res = await axios.get(get_file_url);

      // Construct URL to download the voice file
      const file_url = `${ctx.telegram.options.apiRoot}/file/${ctx.telegram.options.apiMode}${ctx.telegram.token}/${get_file_res.data.result.file_path}`;

      // Download the voice file
      const file_res = await axios.get(file_url, { responseType: 'arraybuffer' });

      // Write the voice file to disk
      fs.writeFileSync(`./voice_input_files/${file_id}.ogg`, file_res.data);

      // Use Watson Speech to Text service to transcribe the voice message into text
      const stt_response = await watson_stt.recognize({
        audio: fs.createReadStream(`./voice_input_files/${file_id}.ogg`),
        contentType: 'audio/ogg',
        model: 'pt-BR_Multimedia',
      });

      console.debug('--------------------------------------------------');
      console.debug('recognized audio ->', stt_response.alternatives[0].transcript);

      // Prepare parameters for sending text message
      const message_params = {
        chat: {
          id: ctx.message.chat.id,
          first_name: ctx.message.chat.first_name,
        },
        text: stt_response.alternatives[0].transcript,
      };

      // Send the transcribed text to message broker for further processing
      const message_response = await text_message_broker(message_params);

      // Synthesize audio responses using Watson Text to Speech service
      const voice_list = [];
      for (let i = 0; i < message_response.length; i++) {
        await watson_tts.synthesize(
          { text: message_response[i].text, accept: 'audio/wav', voice: 'pt-BR_IsabelaV3Voice' },
          { filename: `${file_id}_${i}` }
        );

        voice_list.push(`${file_id}_${i}`);
      }

      console.debug('--------------------------------------------------');
      console.debug('audio response generated successfully -> OK');

      // Remove the temporary voice file from disk
      fs.unlinkSync(`./voice_input_files/${file_id}.ogg`);

      resolve(voice_list);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  start: () => {
    try {
      // Ensure directories for voice input and output files exist, if not, create them
      if (!fs.existsSync('./voice_input_files')) {
        fs.mkdirSync('./voice_input_files');
      }
      if (!fs.existsSync('./voice_output_files')) {
        fs.mkdirSync('./voice_output_files');
      }

      // Create a new instance of the Telegraf bot with the provided Telegram bot token
      const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
      bot.start((ctx) => ctx.reply(`Bem-vindo ${ctx.message.chat.first_name}`));

      bot.on('text', async (ctx) => {
        console.debug('**************************************************');
        console.debug('chat id ->', ctx.message.chat.id);

        const response = await text_message_broker(ctx.message);

        for (let i = 0; i < response.length; i++) {
          if (response[i].response_type === 'text') {
            await ctx.reply(response[i].text);
          }
        }
      });

      bot.on('voice', async (ctx) => {
        console.debug('**************************************************');
        console.debug('chat id ->', ctx.message.chat.id);
        const voice_list = await voice_message_broker(ctx);

        // Iterate over the voice_list and reply with each voice message
        for (let i = 0; i < voice_list.length; i++) {
          if (fs.existsSync(`./voice_output_files/${voice_list[i]}.wav`)) {
            await ctx.replyWithVoice({
              source: fs.createReadStream(`./voice_output_files/${voice_list[i]}.wav`),
            });
          }
        }

        // Delete the processed voice files
        voice_list.forEach((item) => {
          if (fs.existsSync(`./voice_output_files/${item}.wav`)) {
            fs.unlinkSync(`./voice_output_files/${item}.wav`);
          }
        });
      });

      bot.launch();
    } catch (err) {
      console.error(err);
    }
  },
};