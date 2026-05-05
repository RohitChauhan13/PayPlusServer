const { Rate } = require('../models');

const getOrCreateRates = async () => {
  const existing = await Rate.findOne({ order: [['id', 'ASC']] });
  if (existing) {
    return existing;
  }

  return Rate.create({});
};

const updateRates = async (payload) => {
  const rates = await getOrCreateRates();
  await rates.update(payload);
  return rates;
};

module.exports = {
  getOrCreateRates,
  updateRates
};
