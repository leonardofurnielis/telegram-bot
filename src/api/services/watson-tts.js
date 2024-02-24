'use strict';

const fs = require('fs');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = {
  synthesize: (params, options) =>
    new Promise((resolve, reject) => {
      const textToSpeech = new TextToSpeechV1({
        authenticator: new IamAuthenticator({
          apikey: process.env.TTS_API_KEY,
        }),
        serviceUrl:
          'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/459ab8e6-3ce3-4e96-bfc8-b57ab2694402',
      });

      //   const synthesizeParams = {
      //     text: 'Hello world',
      //     accept: 'audio/wav',
      //     voice: 'en-US_AllisonV3Voice',
      //   };

      textToSpeech
        .synthesize(params)
        .then((response) => {
          // The following line is necessary only for
          // wav formats; otherwise, `response.result`
          // can be directly piped to a file.
          return textToSpeech.repairWavHeaderStream(response.result);
        })
        .then((buffer) => {
          fs.writeFileSync(`./voice_output_files/${options.filename}.wav`, buffer);
          resolve();
        })
        .catch((err) => {
          resolve(err);
        });
    }),
};