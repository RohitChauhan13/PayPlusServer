const Joi = require('joi');

const listUsersSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({})
});

const updateUserBlockSchema = Joi.object({
  body: Joi.object({
    is_blocked: Joi.boolean().required()
  }),
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  query: Joi.object({})
});

module.exports = {
  listUsersSchema,
  updateUserBlockSchema
};
