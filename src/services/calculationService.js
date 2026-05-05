const { WORK_FIELDS } = require('../constants/workFields');

const toNumber = (value) => Number(value || 0);

const calculateTotals = (workPayload, rates) => {
  let totalAmount = 0;
  let totalCommission = 0;
  let onlineAmount = 0;
  let cashAmount = 0;

  for (const field of WORK_FIELDS) {
    const quantity = toNumber(workPayload[field]);
    const amount = quantity * toNumber(rates[`${field}_rate`]);
    totalAmount += amount;
    totalCommission += quantity * toNumber(rates[`${field}_commission`]);

    if (workPayload[`${field}_payment_type`] === 'cash') {
      cashAmount += amount;
    } else {
      onlineAmount += amount;
    }
  }

  const onlineNetAmount = onlineAmount * 0.99;
  const salaryAmount = toNumber(workPayload.salary_amount);
  const remainingAmount = onlineNetAmount + cashAmount - (totalCommission + salaryAmount);

  return {
    total_amount: Number(totalAmount.toFixed(2)),
    total_commission: Number(totalCommission.toFixed(2)),
    online_amount: Number(onlineAmount.toFixed(2)),
    online_net_amount: Number(onlineNetAmount.toFixed(2)),
    cash_amount: Number(cashAmount.toFixed(2)),
    salary_amount: Number(salaryAmount.toFixed(2)),
    remaining_amount: Number(remainingAmount.toFixed(2))
  };
};

module.exports = { calculateTotals };
