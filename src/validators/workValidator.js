const Joi = require('joi');
const { WORK_FIELDS } = require('../constants/workFields');

const quantityShape = {};
const optionalQuantityShape = {};

for (const field of WORK_FIELDS) {
  quantityShape[field] = Joi.number().min(0).precision(2).default(0);
  optionalQuantityShape[field] = Joi.number().min(0).precision(2);
  quantityShape[`${field}_payment_type`] = Joi.string().valid('online', 'cash').default('cash');
  optionalQuantityShape[`${field}_payment_type`] = Joi.string().valid('online', 'cash');
}

const dateRangeShape = {
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required()
};

const optionalDateRangeShape = {
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso()
};

const idParam = {
  id: Joi.number().integer().positive().required()
};

const createWorkSchema = Joi.object({
  body: Joi.object({
    ...dateRangeShape,
    ...quantityShape,
    salary_amount: Joi.number().min(0).precision(2).default(0)
  }).required(),
  params: Joi.object({}),
  query: Joi.object({})
});

const updateWorkSchema = Joi.object({
  body: Joi.object({
    ...optionalDateRangeShape,
    ...optionalQuantityShape,
    salary_amount: Joi.number().min(0).precision(2)
  }).min(1),
  params: Joi.object(idParam),
  query: Joi.object({})
});

const listWorkSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
});

const getWorkSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object(idParam),
  query: Joi.object({})
});

module.exports = {
  createWorkSchema,
  updateWorkSchema,
  listWorkSchema,
  getWorkSchema
};
