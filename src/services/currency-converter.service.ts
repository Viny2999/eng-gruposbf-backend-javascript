import { Request, Response } from 'express';
import { LoggerService } from './logger.service';

const logger = LoggerService.getLogger();

export class CurrencyConverterService {

  public converter(req: Request, res: Response): Response {
    logger.debug('CurrencyConverterService :: converter :: a currency converter is requested!');

    logger.info(req.params.currency);
    
    return res.send();    
  }
}
