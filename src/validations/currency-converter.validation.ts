import Joi from 'joi';

const getCurrency = {
  params: Joi.object().keys({
    value: Joi.number().required(),
    currencies: Joi.string().required()
  }),
};

export const getCurrencyValidaion = getCurrency;
