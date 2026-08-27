const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const { signToken } = require('../utils/jwt');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { logAction } = require('../services/auditService');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, roleId } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  let role = null;
  if (roleId) {
    role = await Role.findById(roleId);
    if (!role) throw new ApiError(400, 'Invalid role');
  } else {
    role = await Role.findOne({ name: 'Employee' });
    if (!role) {
      role = await Role.create({ name: 'Employee', description: 'Default employee role' });
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: role._id });
  await user.populate('role');

  await logAction({
    userId: user._id,
    action: 'USER_REGISTERED',
    entityType: 'User',
    entityId: user._id,
    newValue: { name, email, role: role.name },
    req,
  });

  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role.name },
    user: { id: user._id, name: user.name, email: user.email, role: user.role.name },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('role');
  if (!user || user.status !== 'ACTIVE') {
    throw new ApiError(401, 'Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const token = signToken({ sub: user._id.toString(), role: user.role.name });

  await logAction({
    userId: user._id,
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: user._id,
    req,
  });

  res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role.name },
    },
  });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = { register, login, me };
