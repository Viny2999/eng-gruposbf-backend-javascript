import { Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { LoggerService } from './logger.service';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = LoggerService.getLogger();
const BASE_URL = process.env.BASE_URL;

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

    const URLMounted = this.createCurrencyApiUrl(currencies);

    try {
      const response = await (await axios.get(URLMounted)).data;      
      return this.parseCurrenciesSellValues(currenciesKeys, response, valueToConvert);
    } catch (error) {
      throw error;
    }
  };

  public filterCurrencyEmpties = (currencies: string[]): string[] => currencies.filter(currency => currency !== '');

  public currenciesKeyMapping = (currencies: string[]) => currencies.map(currency => {
    return {
      name: currency,
      key: `${currency}BRL`
    };
  });

  public createCurrenciesParams = (currencies: string[]) => currencies.reduce((acc, currentValue) => {
    return acc += `${currentValue}-BRL,`;
  }, '');

  public createCurrencyApiUrl = (currencies: string[]) => {
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
