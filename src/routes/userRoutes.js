const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { listUsersSchema, updateUserBlockSchema } = require('../validators/userValidator');

const router = express.Router();

router.use(authenticate, authorize('super_admin'));

router.get('/', validate(listUsersSchema), userController.listUsers);
router.put('/:id/block', validate(updateUserBlockSchema), userController.updateUserBlock);

module.exports = router;
