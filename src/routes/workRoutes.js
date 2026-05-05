const express = require('express');
const workController = require('../controllers/workController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  createWorkSchema,
  updateWorkSchema,
  listWorkSchema,
  getWorkSchema
} = require('../validators/workValidator');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(validate(createWorkSchema), workController.createWork)
  .get(validate(listWorkSchema), workController.listWork);

router
  .route('/:id')
  .get(validate(getWorkSchema), workController.getWork)
  .put(validate(updateWorkSchema), workController.updateWork)
  .delete(validate(getWorkSchema), workController.deleteWork);

module.exports = router;
