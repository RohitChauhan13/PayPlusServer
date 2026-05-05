const express = require('express');
const rateController = require('../controllers/rateController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { updateRatesSchema } = require('../validators/rateValidator');

const router = express.Router();

router.get('/', authenticate, rateController.getRates);
router.put('/', authenticate, authorize('admin', 'super_admin'), validate(updateRatesSchema), rateController.putRates);

module.exports = router;
