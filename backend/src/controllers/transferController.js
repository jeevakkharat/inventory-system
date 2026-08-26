const mongoose = require('mongoose');
const Transfer = require('../models/Transfer');
const Item = require('../models/Item');
const Location = require('../models/Location');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { logAction } = require('../services/auditService');

// POST /api/transfers
// Prevents transfers that exceed available stock, per SRS 2.5.
const createTransfer = asyncHandler(async (req, res) => {
  const { itemId, sourceLocationId, destinationLocationId, quantity } = req.body;

  if (sourceLocationId === destinationLocationId) {
    throw new ApiError(400, 'Source and destination locations must differ');
  }

  const session = await mongoose.startSession();
  try {
    let createdTransfer;

    await session.withTransaction(async () => {
      const item = await Item.findById(itemId).session(session);
      if (!item) throw new ApiError(404, 'Item not found');
      if (item.quantity < quantity) {
        throw new ApiError(400, `Insufficient stock: available ${item.quantity}, requested ${quantity}`);
      }

      const [source, destination] = await Promise.all([
        Location.findById(sourceLocationId).session(session),
        Location.findById(destinationLocationId).session(session),
      ]);
      if (!source || !destination) throw new ApiError(404, 'Source or destination location not found');

      const [transfer] = await Transfer.create(
        [
          {
            item: itemId,
            sourceLocation: sourceLocationId,
            destinationLocation: destinationLocationId,
            quantity,
            initiatedBy: req.user.id,
            status: 'PENDING',
          },
        ],
        { session }
      );

      await logAction({
        session,
        userId: req.user.id,
        action: 'TRANSFER_CREATED',
        entityType: 'Transfer',
        entityId: transfer._id,
        newValue: transfer,
        req,
      });

      createdTransfer = transfer;
    });

    res.status(201).json({ success: true, data: createdTransfer });
  } finally {
    session.endSession();
  }
});

// GET /api/transfers
const listTransfers = asyncHandler(async (req, res) => {
  const transfers = await Transfer.find()
    .populate('item')
    .populate('sourceLocation')
    .populate('destinationLocation')
    .populate('initiatedBy', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: transfers });
});

// PUT /api/transfers/:id/status
const updateTransferStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const session = await mongoose.startSession();
  try {
    let updatedTransfer;

    await session.withTransaction(async () => {
      const transfer = await Transfer.findById(id).session(session);
      if (!transfer) throw new ApiError(404, 'Transfer not found');
      if (transfer.status === 'COMPLETED' || transfer.status === 'REJECTED') {
        throw new ApiError(400, `Transfer is already ${transfer.status.toLowerCase()}`);
      }

      if (status === 'COMPLETED') {
        const item = await Item.findById(transfer.item).session(session);
        if (item.quantity < transfer.quantity) {
          throw new ApiError(400, 'Insufficient stock to complete this transfer');
        }
        // Net quantity on the item is unchanged by a same-item location move;
        // the transfer document itself is the source of truth for location.
      }

      const before = transfer.status;
      transfer.status = status;
      await transfer.save({ session });

      await logAction({
        session,
        userId: req.user.id,
        action: 'TRANSFER_STATUS_UPDATED',
        entityType: 'Transfer',
        entityId: transfer._id,
        oldValue: { status: before },
        newValue: { status },
        req,
      });

      updatedTransfer = transfer;
    });

    res.json({ success: true, data: updatedTransfer });
  } finally {
    session.endSession();
  }
});

module.exports = { createTransfer, listTransfers, updateTransferStatus };
