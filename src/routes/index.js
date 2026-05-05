const express = require('express');
const authRoutes = require('./authRoutes');
const rateRoutes = require('./rateRoutes');
const userRoutes = require('./userRoutes');
const workRoutes = require('./workRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'PayPlus API is healthy'
  });
});

router.use('/auth', authRoutes);
router.use('/rates', rateRoutes);
router.use('/users', userRoutes);
router.use('/work', workRoutes);

module.exports = router;
