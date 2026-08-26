const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');
const Item = require('../models/Item');
const User = require('../models/User');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { logAction } = require('../services/auditService');

// POST /api/assignments
const createAssignment = asyncHandler(async (req, res) => {
  const { itemId, userId } = req.body;

  const session = await mongoose.startSession();
  try {
    let created;

    await session.withTransaction(async () => {
      const [item, user] = await Promise.all([
        Item.findById(itemId).session(session),
        User.findById(userId).session(session),
      ]);
      if (!item) throw new ApiError(404, 'Item not found');
      if (!user) throw new ApiError(404, 'User not found');
      if (item.quantity < 1) throw new ApiError(400, 'No available stock to assign');

      const [assignment] = await Assignment.create(
        [{ item: itemId, user: userId, assignedBy: req.user.id }],
        { session }
      );

      item.quantity -= 1;
      await item.save({ session });

      await logAction({
        session,
        userId: req.user.id,
        action: 'ASSET_ASSIGNED',
        entityType: 'Assignment',
        entityId: assignment._id,
        newValue: assignment,
        req,
      });

      created = assignment;
    });

    res.status(201).json({ success: true, data: created });
  } finally {
    session.endSession();
  }
});

// GET /api/assignments
const listAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find()
    .populate('item')
    .populate('user', 'name')
    .populate('assignedBy', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: assignments });
});

// PUT /api/assignments/:id/return
const returnAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  try {
    let updated;

    await session.withTransaction(async () => {
      const assignment = await Assignment.findById(id).session(session);
      if (!assignment) throw new ApiError(404, 'Assignment not found');
      if (assignment.status === 'RETURNED') throw new ApiError(400, 'Asset already returned');

      assignment.status = 'RETURNED';
      assignment.returnedAt = new Date();
      await assignment.save({ session });

      await Item.updateOne({ _id: assignment.item }, { $inc: { quantity: 1 } }).session(session);

      await logAction({
        session,
        userId: req.user.id,
        action: 'ASSET_RETURNED',
        entityType: 'Assignment',
        entityId: assignment._id,
        newValue: assignment,
        req,
      });

      updated = assignment;
    });

    res.json({ success: true, data: updated });
  } finally {
    session.endSession();
  }
});

module.exports = { createAssignment, listAssignments, returnAssignment };
