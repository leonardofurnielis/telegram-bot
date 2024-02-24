'use strict';

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = {
  recognize: (params) =>
    new Promise((resolve, reject) => {
      const speechToText = new SpeechToTextV1({
        authenticator: new IamAuthenticator({
          apikey: process.env.STT_API_KEY,
        }),
        serviceUrl:
          'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/b6e5a334-1f4d-4c2e-ae44-6c2bbea6a861',
      });

      //   const recognizeParams = {
      //     audio: fs.createReadStream(audio_path),
      //     contentType: 'audio/flac',
      //     wordAlternativesThreshold: 0.9,
      //     keywords: ['colorado', 'tornado', 'tornadoes'],
      //     keywordsThreshold: 0.5,
      //   };

      speechToText
        .recognize(params)
        .then((speechRecognitionResults) => {

          resolve(speechRecognitionResults.result.results[0]);
        })
        .catch((err) => {
          reject(err);
        });
    }),
};