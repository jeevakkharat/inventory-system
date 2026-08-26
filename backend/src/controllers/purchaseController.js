const mongoose = require('mongoose');
const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { logAction } = require('../services/auditService');

// POST /api/purchases
// Records a purchase, increments item stock, and writes audit entries —
// all inside a single MongoDB session transaction so a failure anywhere
// rolls everything back (the "trickiest implementation" per the SRS video plan).
// Requires MongoDB running as a replica set (local single-node RS or Atlas).
const createPurchase = asyncHandler(async (req, res) => {
  const { supplierId, items } = req.body;

  const session = await mongoose.startSession();
  try {
    let createdPurchase;

    await session.withTransaction(async () => {
      const itemIds = items.map((i) => i.itemId);
      const dbItems = await Item.find({ _id: { $in: itemIds } }).session(session);
      if (dbItems.length !== itemIds.length) {
        throw new ApiError(400, 'One or more items do not exist');
      }
      const dbItemMap = new Map(dbItems.map((d) => [d._id.toString(), d]));

      const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

      const [purchase] = await Purchase.create(
        [
          {
            supplierId,
            totalAmount,
            status: 'COMPLETED',
            createdBy: req.user.id,
            items: items.map((i) => ({ item: i.itemId, quantity: i.quantity, unitPrice: i.unitPrice })),
          },
        ],
        { session }
      );

      for (const line of items) {
        const before = dbItemMap.get(line.itemId);
        await Item.updateOne(
          { _id: line.itemId },
          { $inc: { quantity: line.quantity } }
        ).session(session);

        await logAction({
          session,
          userId: req.user.id,
          action: 'INVENTORY_INCREASED',
          entityType: 'Item',
          entityId: line.itemId,
          oldValue: { quantity: before.quantity },
          newValue: { quantity: before.quantity + line.quantity, reason: `Purchase #${purchase._id}` },
          req,
        });
      }

      await logAction({
        session,
        userId: req.user.id,
        action: 'PURCHASE_CREATED',
        entityType: 'Purchase',
        entityId: purchase._id,
        newValue: purchase,
        req,
      });

      createdPurchase = purchase;
    });

    res.status(201).json({ success: true, data: createdPurchase });
  } finally {
    session.endSession();
  }
});

// GET /api/purchases
const listPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find()
    .populate('items.item')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: purchases });
});

// GET /api/purchases/:id
const getPurchase = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id)
    .populate('items.item')
    .populate('createdBy', 'name');
  if (!purchase) throw new ApiError(404, 'Purchase not found');
  res.json({ success: true, data: purchase });
});

module.exports = { createPurchase, listPurchases, getPurchase };
