const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { logAction } = require('../services/auditService');

const shape = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role?.name,
  status: u.status,
});

// GET /api/users
const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('role').sort({ createdAt: 1 });
  res.json({ success: true, data: users.map(shape) });
});

// GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('role');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: shape(user) });
});

// POST /api/users  (admin creates a user)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, roleId } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await (await User.create({ name, email, passwordHash, role: roleId })).populate('role');

  await logAction({
    userId: req.user.id,
    action: 'USER_CREATED',
    entityType: 'User',
    entityId: user._id,
    newValue: { name, email, role: user.role.name },
    req,
  });

  res.status(201).json({ success: true, data: shape(user) });
});

// PUT /api/users/:id  (update profile, role, or active status)
const updateUser = asyncHandler(async (req, res) => {
  const existing = await User.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'User not found');

  const { name, roleId, status } = req.body;
  const before = { name: existing.name, role: existing.role, status: existing.status };

  if (name) existing.name = name;
  if (roleId) existing.role = roleId;
  if (status) existing.status = status;
  await existing.save();
  await existing.populate('role');

  await logAction({
    userId: req.user.id,
    action: 'USER_UPDATED',
    entityType: 'User',
    entityId: existing._id,
    oldValue: before,
    newValue: { name, roleId, status },
    req,
  });

  res.json({ success: true, data: shape(existing) });
});

module.exports = { listUsers, getUser, createUser, updateUser };
