const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../services/tokenService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  is_blocked: Boolean(user.is_blocked),
  created_at: user.created_at,
  updated_at: user.updated_at
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const requiresApproval = role === 'super_admin';

  const user = await User.create({
    name,
    email,
    password_hash: passwordHash,
    role,
    is_blocked: requiresApproval
  });

  res.status(201).json({
    success: true,
    data: {
      user: formatUser(user),
      token: requiresApproval ? null : signToken(user),
      requiresApproval
    },
    message: requiresApproval
      ? 'Super admin request sent for approval. You can login after approval.'
      : 'Account created successfully.'
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.scope('withPassword').findOne({ where: { email } });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.is_blocked && user.role === 'super_admin') {
    throw new ApiError(403, 'Your super admin request is pending approval.');
  }

  if (user.is_blocked) {
    throw new ApiError(403, 'Your account is blocked. Please contact the admin.');
  }

  res.json({
    success: true,
    data: {
      user: formatUser(user),
      token: signToken(user)
    }
  });
});

module.exports = {
  register,
  login
};
