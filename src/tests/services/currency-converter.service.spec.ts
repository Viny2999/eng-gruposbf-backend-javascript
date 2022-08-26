import { CurrencyConverterService } from '../../services/currency-converter.service';
import axios from 'axios';
import * as mockAxios from './mock-axios.fixture.json';

describe('CurrencyConverter Service', () => {
  let currencyConverterService: CurrencyConverterService;

  beforeAll(() => {
    currencyConverterService = new CurrencyConverterService();
  });

  it('service should be defined', () => {
    expect(currencyConverterService).toBeDefined();
  });

  describe('converterValue method', () => {
    it('should return right values', async () => {
      const value= 2500;
      const currencies = ['USD','EUR'];
      const valueConvertedExpected = {
        USD:'12704.00',
        EUR:'12768.00'
      };

      jest.spyOn(axios, 'get').mockImplementation(() => mockAxios as any);

      const valueReceived = await currencyConverterService.converterValue(value, currencies);
      
      expect(valueReceived).toStrictEqual(valueConvertedExpected);
    });
  });
});
