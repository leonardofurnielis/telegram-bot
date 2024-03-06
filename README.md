# IBM watsonx Assistant Telegram Integration

![workflow](https://github.com/leonardofurnielis/telegram-bot-sentiment/actions/workflows/build-test.yml/badge.svg)
[![codecov](https://codecov.io/gh/leonardofurnielis/telegram-bot-sentiment/branch/master/graph/badge.svg?token=deQmKPNEIY)](https://codecov.io/gh/leonardofurnielis/telegram-bot-sentiment)

## Table of Contents

- Developing locally
  - [Native runtime](#native-runtime)
  - [Containerized](#containerized)

## Native runtime 

To run this code in your computer execute the following commands into project root directory

```bash
npm install
npm start
```

## Containerized

To run this code using Docker container execute the following commands into project root directory

```bash
docker build -t telegram-bot .
docker run -p 8080:3000 -d telegram-bot
```
