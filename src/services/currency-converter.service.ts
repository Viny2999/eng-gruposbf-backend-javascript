import { Request, Response } from 'express';
import { LoggerService } from './logger.service';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = LoggerService.getLogger();
const BASE_URL = process.env.BASE_URL;

export class CurrencyConverterService {

  public async converter(req: Request, res: Response): Promise<Response> {
    logger.debug('CurrencyConverterService :: converter :: a currency converter is requested!');

    const value = req.params.value as any;
    const currencies = req.params.currencies.replace(/\s+/, '') .split(',');

    const currenciesFiltered = currencies.filter(currency => currency !== '');

    console.log(currenciesFiltered);

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
      const status = error.response.data.status;
      const message = error.response.data.message;

      logger.error('CurrencyConverterService :: converter :: Error : ', message);
      return res.status(status).send({ message: message });
    }

    currenciesKeys.forEach(currency => {
      currenciesSellValues[currency.name] = (response[currency.key].ask * value);
    });
    
    return res.send(currenciesSellValues);    
  }
}
