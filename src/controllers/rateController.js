const asyncHandler = require('../utils/asyncHandler');
const { getOrCreateRates, updateRates } = require('../services/rateService');

const getRates = asyncHandler(async (_req, res) => {
  const rates = await getOrCreateRates();
  res.json({
    success: true,
    data: rates
  });
});

const putRates = asyncHandler(async (req, res) => {
  const rates = await updateRates(req.body);
  res.json({
    success: true,
    data: rates
  });
});

module.exports = {
  getRates,
  putRates
};
