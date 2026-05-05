const { Op } = require('sequelize');
const { WorkEntry, User } = require('../models');
const { WORK_FIELDS } = require('../constants/workFields');
const { getOrCreateRates } = require('../services/rateService');
const { calculateTotals } = require('../services/calculationService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const buildWorkPayload = (body, existing = {}) => {
  const payload = {
    start_date: body.start_date ?? existing.start_date,
    end_date: body.end_date ?? existing.end_date
  };

  for (const field of WORK_FIELDS) {
    payload[field] = body[field] ?? existing[field] ?? 0;
    payload[`${field}_payment_type`] =
      body[`${field}_payment_type`] ?? existing[`${field}_payment_type`] ?? 'cash';
  }

  payload.salary_amount = body.salary_amount ?? existing.salary_amount ?? 0;

  return payload;
};

const assertValidDateRange = (payload) => {
  if (new Date(payload.end_date) < new Date(payload.start_date)) {
    throw new ApiError(400, 'end_date must be greater than or equal to start_date');
  }
};

const includeCreator = {
  model: User,
  as: 'creator',
  attributes: ['id', 'name', 'email', 'role', 'is_blocked']
};

const createWork = asyncHandler(async (req, res) => {
  const rates = await getOrCreateRates();
  const payload = buildWorkPayload(req.body);
  const totals = calculateTotals(payload, rates);

  const workEntry = await WorkEntry.create({
    ...payload,
    ...totals,
    created_by: req.user.id
  });

  res.status(201).json({
    success: true,
    data: workEntry
  });
});

const listWork = asyncHandler(async (req, res) => {
  const { startDate, endDate, page, limit } = req.query;
  const where = {};

  if (startDate && endDate) {
    where[Op.and] = [
      { start_date: { [Op.lte]: endDate } },
      { end_date: { [Op.gte]: startDate } }
    ];
  } else if (startDate) {
    where.end_date = { [Op.gte]: startDate };
  } else if (endDate) {
    where.start_date = { [Op.lte]: endDate };
  }

  const offset = (page - 1) * limit;
  const { rows, count } = await WorkEntry.findAndCountAll({
    where,
    include: [includeCreator],
    order: [
      ['start_date', 'DESC'],
      ['id', 'DESC']
    ],
    limit,
    offset
  });

  res.json({
    success: true,
    data: rows,
    meta: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  });
});

const getWork = asyncHandler(async (req, res) => {
  const workEntry = await WorkEntry.findByPk(req.params.id, {
    include: [includeCreator]
  });

  if (!workEntry) {
    throw new ApiError(404, 'Work entry not found');
  }

  res.json({
    success: true,
    data: workEntry
  });
});

const updateWork = asyncHandler(async (req, res) => {
  const workEntry = await WorkEntry.findByPk(req.params.id);

  if (!workEntry) {
    throw new ApiError(404, 'Work entry not found');
  }

  const rates = await getOrCreateRates();
  const payload = buildWorkPayload(req.body, workEntry);
  assertValidDateRange(payload);
  const totals = calculateTotals(payload, rates);

  await workEntry.update({
    ...payload,
    ...totals
  });

  res.json({
    success: true,
    data: workEntry
  });
});

const deleteWork = asyncHandler(async (req, res) => {
  const workEntry = await WorkEntry.findByPk(req.params.id);

  if (!workEntry) {
    throw new ApiError(404, 'Work entry not found');
  }

  await workEntry.destroy();

  res.json({
    success: true,
    message: 'Work entry deleted'
  });
});

module.exports = {
  createWork,
  listWork,
  getWork,
  updateWork,
  deleteWork
};
