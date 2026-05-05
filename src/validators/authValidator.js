const Joi = require('joi');

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(120).required(),
    email: Joi.string().trim().email().max(180).required(),
    password: Joi.string().min(8).max(72).required(),
    role: Joi.string().valid('admin', 'super_admin').default('admin'),
    is_blocked: Joi.boolean().default(false)
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

module.exports = {
  registerSchema,
  loginSchema
};
