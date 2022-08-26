import { CurrencyConverterService } from '../../services';
import { Router } from 'express';

const router = Router();
const currencyConverterService = new CurrencyConverterService();

router.get('/:currency', currencyConverterService.converter);

export const CurrencyConverterController: Router = router;
