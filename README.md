# telegram-bot-sentiment

![workflow](https://github.com/leonardofurnielis/telegram-bot-sentiment/actions/workflows/test-coverage.yml/badge.svg)
[![codecov](https://codecov.io/gh/leonardofurnielis/telegram-bot-sentiment/branch/master/graph/badge.svg?token=deQmKPNEIY)](https://codecov.io/gh/leonardofurnielis/telegram-bot-sentiment)

## Table of Contents

- [Local](#local)
- [Docker](#docker)

## Local

To run this code in your computer execute the following commands into project root directory

```bash
$ npm install
$ npm start
```

## Docker

To run this code using Docker container execute the following commands into project root directory

```bash
$ docker build -t telegram-bot-sentiment .
$ docker run -p 8080:3000 -d telegram-bot-sentiment
```
