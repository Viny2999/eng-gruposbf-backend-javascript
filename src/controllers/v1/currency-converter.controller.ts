import { CurrencyConverterService } from '../../services';
import { JoiValidate } from '../../middlewares/validate';
import { getCurrencyValidaion } from '../../validations/currency-converter.validation';
import { Router } from 'express';

const router = Router();
const currencyConverterService = new CurrencyConverterService();

router.get('/:value/:currencies', JoiValidate(getCurrencyValidaion) , currencyConverterService.converter);

export const CurrencyConverterController: Router = router;
