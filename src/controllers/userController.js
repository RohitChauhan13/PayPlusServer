const { Op } = require('sequelize');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const publicAttributes = ['id', 'name', 'email', 'role', 'is_blocked', 'created_at', 'updated_at'];

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.findAll({
    attributes: publicAttributes,
    where: {
      [Op.or]: [
        { role: 'admin' },
        { role: 'super_admin', is_blocked: true }
      ]
    },
    order: [
      ['is_blocked', 'ASC'],
      ['name', 'ASC']
    ]
  });

  res.json({
    success: true,
    data: users
  });
});

const updateUserBlock = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.id === req.user.id && req.body.is_blocked) {
    throw new ApiError(400, 'You cannot block your own account');
  }

  if (user.role === 'super_admin' && req.body.is_blocked) {
    throw new ApiError(400, 'Super admin accounts cannot be blocked');
  }

  await user.update({ is_blocked: req.body.is_blocked });

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_blocked: Boolean(user.is_blocked),
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  });
});

module.exports = {
  listUsers,
  updateUserBlock
};
