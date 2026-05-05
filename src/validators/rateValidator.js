const Joi = require('joi');
const { WORK_FIELDS } = require('../constants/workFields');

const rateShape = {};

for (const field of WORK_FIELDS) {
  rateShape[`${field}_rate`] = Joi.number().min(0).precision(2);
  rateShape[`${field}_commission`] = Joi.number().min(0).precision(2);
}

const updateRatesSchema = Joi.object({
  body: Joi.object(rateShape).min(1).required(),
  params: Joi.object({}),
  query: Joi.object({})
});

module.exports = { updateRatesSchema };
