'use strict';

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = {
  message: (params) =>
    new Promise((resolve, reject) => {
      const assistant = new AssistantV2({
        version: '2020-04-01',
        authenticator: new IamAuthenticator({
          apikey: process.env.ASSISTANT_KEY,
        }),
        serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com',
      });

      assistant
        .messageStateless({
          assistantId: process.env.ASSISTANT_ID,
          input: {
            message_type: 'text',
            text: params.text,
          },
          context: params.context || {},
        })
        .then((res) => {
          resolve(res.result);
        })
        .catch((err) => {
          reject(err);
        });
    }),
};
