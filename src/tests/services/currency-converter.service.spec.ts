import { CurrencyConverterService } from '../../services/currency-converter.service';
import axios from 'axios';
import * as mockAxios from './mock-axios.fixture.json';
import * as dotenv from 'dotenv';
dotenv.config();

describe('CurrencyConverter Service', () => {
  let currencyConverterService: CurrencyConverterService;
  const valueToConvert = 2500;
  const currencies = ['USD','EUR'];
  const BASE_URL = process.env.BASE_URL;

  beforeAll(() => {
    currencyConverterService = new CurrencyConverterService();
  });

  it('service should be defined', () => {
    expect(currencyConverterService).toBeDefined();
  });

  describe('converterValue method', () => {
    it('should return right values', async () => {
      const valueConvertedExpected = {
        USD:'12704.00',
        EUR:'12768.00'
      };

      jest.spyOn(axios, 'get').mockImplementation(() => mockAxios as any);

      const valueReceived = await currencyConverterService.converterValue(valueToConvert, currencies);
      
      expect(valueReceived).toStrictEqual(valueConvertedExpected);
    });
  });

  describe('filterCurrencyEmpties method', () => {
    const currenciesWithEmptyString = ['USD','EUR', ''];
    it('should return currencies filtered', () => {
      const currenciesFiltered = currencyConverterService.filterCurrencyEmpties(currenciesWithEmptyString);
      expect(currenciesFiltered).toStrictEqual(currencies);
    });
  });

  describe('currenciesKeyMapping method', () => {
    const keyMapppingExpected = [
      {
        name: currencies[0],
        key:  `${currencies[0]}BRL`
      },
      {
        name: currencies[1],
        key:  `${currencies[1]}BRL`
      }
    ];

    it('should return right key mapping', () => {
      const currenciesKeyMapping = currencyConverterService.currenciesKeyMapping(currencies);
      expect(currenciesKeyMapping).toStrictEqual(keyMapppingExpected);
    });
  });
  
  describe('createCurrenciesParams method', () => {
    const currenciesParamsExpected = 'USD-BRL,EUR-BRL,'
    it('should return right params', () => {
      const currenciesParams = currencyConverterService.createCurrenciesParams(currencies);
      expect(currenciesParams).toStrictEqual(currenciesParamsExpected);
    });
  });

  describe('createCurrencyApiUrl method', () => {
    const currencyApiUrlExpected =  `${BASE_URL}/USD-BRL,EUR-BRL`;
    it('should return right url', () => {
      const currencyApiUrl = currencyConverterService.createCurrencyApiUrl(currencies);
      expect(currencyApiUrl).toStrictEqual(currencyApiUrlExpected);
    });
  });

  describe('useTwoDecimalPlaces method', () => {
    it('should return right value parsed', () => {
      const numberExpected = '10.00';
      const numberToParse = currencyConverterService.useTwoDecimalPlaces(10.0000);
      expect(numberToParse).toEqual(numberExpected);
    });
  });

  describe('calculateValue method', () => {
    it('should return right value', () => {
      const valueExpected = '100.00';
      const valueCalculated = currencyConverterService.calculateValue(2, 50);
      expect(valueCalculated).toEqual(valueExpected);
    });
  });
});
