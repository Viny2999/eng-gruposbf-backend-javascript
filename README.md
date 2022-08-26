# Grupo SBF Challenge
[![Fly.io](https://github.com/Viny2999/eng-gruposbf-backend-javascript/actions/workflows/master.yml/badge.svg?branch=master)](https://github.com/Viny2999/eng-gruposbf-backend-javascript/actions/workflows/master.yml)
[![Tests](https://github.com/Viny2999/eng-gruposbf-backend-javascript/actions/workflows/dev.yml/badge.svg?branch=dev)](https://github.com/Viny2999/eng-gruposbf-backend-javascript/actions/workflows/dev.yml)

API Developed with NodeJS and Typescript solve SBF Backend Challenge.

Aplication deployed in Fly.io using Github Action.

[Check deployed app here](https://eng-gruposbf-backend-javascript.fly.dev/v1/health)

## Instructions to Run Locally
There are two ways to run the application:
* Using Docker Compose:
  ```
  docker-compose up
  ``` 
* Using NPM:
  ```
  npm install
  npm start
  ``` 

## Brief Explanation
The application makes a request to the External API [api-de-moedas](https://docs.awesomeapi.com.br/api-de-moedas) and saves the price information of each currency in cache for 4 minutes for a more efficient return.
## Swagger
* `/v1/docs` - Contains a Swagger Page.

## How to Converte
* `/v1/converter/{value}/{currencies}`: 

  In `value` insert the number to convert, in `currencies` insert the currencies separeted by comma.

  Like: `/v1/converter/2000/USD,EUR`

## Tests
To start jest unit tests run:
```
npm test
```
