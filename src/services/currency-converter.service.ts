import { Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { LoggerService } from './logger.service';
import { CacheService } from './cache.service';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = LoggerService.getLogger();
const BASE_URL = process.env.BASE_URL;

const cacheService = new CacheService();

export class CurrencyConverterService {

  public converter = async (req: Request, res: Response): Promise<Response> => {
    logger.debug('CurrencyConverterService :: converter :: a currency converter is requested!');

    const valueToConvert = req.params.value as any;
    const currencies = req.params.currencies.replace(/\s+/, '') .split(',');

    try {
      const currenciesSellValues = await this.converterValue(valueToConvert, currencies);
      return res.send(currenciesSellValues);    
    } catch (error) {
      const status = error.response?.data.status;
      if (status === 404) {
        const message = error.response.data.message;
        logger.error('CurrencyConverterService :: converter :: Error : ', message);
        return res.status(status).send({ message: message });
      } else {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
      }
    }
  };

  public converterValue = async (valueToConvert: number, currencies: string[]): Promise<any> => {
    const currenciesFiltered = this.filterCurrencyEmpties(currencies);

    const currenciesKeys = this.currenciesKeyMapping(currenciesFiltered);

    const cacheData = this.getInCacheApiReponse(currenciesKeys);

    const currenciesRemaining = this.filterCurrenciesRemaining(cacheData);

    const currenciesCached = this.filterCurrenciesCached(cacheData);

    let responsePopulatedByCache = this.populateResponseWithCache(currenciesCached);

    if (currenciesRemaining.length !== 0) {
      try {
        const URLMounted = this.createCurrencyApiUrl(currenciesRemaining);
        const response = await (await axios.get(URLMounted)).data;
        this.storeInCacheApiReponse(response);

        responsePopulatedByCache = {
          ...responsePopulatedByCache,
          ...response
        }

      } catch (error) {
        throw error;
      }
    }

    return this.parseCurrenciesSellValues(currenciesKeys, responsePopulatedByCache, valueToConvert);
  };

  public populateResponseWithCache = (currenciesCached) => {
    let responseRetrieved = {};
    currenciesCached.forEach(currencyCached => {
      responseRetrieved[currencyCached.key] = currencyCached.object
    })
    return responseRetrieved;
  }

  public filterCurrenciesRemaining = (cacheData) => cacheData.filter(currency => !currency.has);

  public filterCurrenciesCached = (cacheData) => cacheData.filter(currency => currency.has);

  public getInCacheApiReponse = (currenciesKeys): any[] => {
    const currenciesInCache = currenciesKeys.map(currency => {
      const hasKey = cacheService.checkKey(currency.key);
      if (hasKey) {
        return {
          ...currency,
          has: true,
          object: cacheService.get(currency.key)
        }
      } else {
        return {
          ...currency,
          has: false,
          object: null
        }
      }
    });

    return currenciesInCache;
  }

  public storeInCacheApiReponse = async (apiReponse) => {
    for (const key in apiReponse) {
      cacheService.set(key, apiReponse[key]);
    }
  }

  public filterCurrencyEmpties = (currencies: string[]): string[] => currencies.filter(currency => currency !== '');

  public currenciesKeyMapping = (currencies: string[]) => currencies.map(currency => {
    return {
      name: currency,
      key: `${currency}BRL`
    };
  });

  public createCurrenciesParams = (currencies: any[]) => currencies.reduce((acc, currentValue) => {
    return acc += `${currentValue.name}-BRL,`;
  }, '');

  public createCurrencyApiUrl = (currencies: any[]) => {
    const currenciesParams = this.createCurrenciesParams(currencies);

    const currenciesParamsParsed = currenciesParams.slice(0, -1);
    return `${BASE_URL}/${currenciesParamsParsed}`;
  };

  public parseCurrenciesSellValues = (currenciesKeys, apiReponse, valueToConvert) => {
    let currenciesSellValues = {};

    currenciesKeys.forEach(currency => {
      
      const sellValue = apiReponse[currency.key].ask;
      const valueCalculated = this.calculateValue(valueToConvert, sellValue);
      currenciesSellValues[currency.name] = valueCalculated;
    });

    return currenciesSellValues;
  };

  public useTwoDecimalPlaces = (numberToParse: number) => numberToParse.toFixed(2);

  public calculateValue = (valueToConvert, sellValue) => this.useTwoDecimalPlaces((sellValue * valueToConvert));

}
