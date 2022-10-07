'use strict';

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = {
  analyze: (params) =>
    new Promise((resolve, reject) => {
      const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2022-04-07',
        authenticator: new IamAuthenticator({
          apikey: process.env.NLU_API_KEY,
        }),
        serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com',
      });

      const analyzeParams = {
        text: params.text,
        features: {
          sentiment: {
            document: true,
          },
        },
        language: 'pt',
      };

      naturalLanguageUnderstanding
        .analyze(analyzeParams)
        .then((res) => {
          resolve(res.result);
        })
        .catch((err) => {
          reject(err);
        });
    }),
};
