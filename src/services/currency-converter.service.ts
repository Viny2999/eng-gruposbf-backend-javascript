import { Request, Response } from 'express';
import { LoggerService } from './logger.service';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = LoggerService.getLogger();
const BASE_URL = process.env.BASE_URL;

export class CurrencyConverterService {

  public converter = async (req: Request, res: Response): Promise<Response> => {
    logger.debug('CurrencyConverterService :: converter :: a currency converter is requested!');

    const value = req.params.value as any;
    const currencies = req.params.currencies.replace(/\s+/, '') .split(',');

    try {
      const currenciesSellValues = await this.converterValue(value, currencies);
      return res.send(currenciesSellValues);    
    } catch (error) {
      const status = error.response.data.status;
      const message = error.response.data.message;

      logger.error('CurrencyConverterService :: converter :: Error : ', message);
      return res.status(status).send({ message: message });
    }
  }

  public converterValue = async (value: number, currencies: string[]): Promise<any> => {
    const currenciesFiltered = currencies.filter(currency => currency !== '');

    const currenciesKeys = currenciesFiltered.map(currency => {
      return {
        name: currency,
        key: `${currency}BRL`
      };
    });

    const currenciesParams = currenciesFiltered.reduce((acc, currentValue) => {
      return acc += `${currentValue}-BRL,`;
    }, '');

    const currenciesParamsParsed = currenciesParams.slice(0, -1);
    const URLMounted = `${BASE_URL}/${currenciesParamsParsed}`;

    let currenciesSellValues = {};
    let response;

    try {
      response = await (await axios.get(URLMounted)).data;      
    } catch (error) {
      throw error
    }

    currenciesKeys.forEach(currency => {
      currenciesSellValues[currency.name] = (response[currency.key].ask * value).toFixed(2);
    });

    return currenciesSellValues;
  }

}
