const Item = require('../models/Item');
require('../models/Category');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { logAction } = require('../services/auditService');

// GET /api/items?search=&categoryId=&status=
const listItems = asyncHandler(async (req, res) => {
  const { search, categoryId, status } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }
  if (categoryId) filter.category = categoryId;
  if (status) filter.status = status;

  const items = await Item.find(filter).populate('category').sort({ createdAt: 1 });
  res.json({ success: true, data: items });
});

// GET /api/items/:id
const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('category');
  if (!item) throw new ApiError(404, 'Item not found');
  res.json({ success: true, data: item });
});

// POST /api/items
const createItem = asyncHandler(async (req, res) => {
  const { name, sku, categoryId, quantity } = req.body;

  const item = await Item.create({ name, sku, category: categoryId, quantity: quantity ?? 0 });

  await logAction({
    userId: req.user.id,
    action: 'ITEM_CREATED',
    entityType: 'Item',
    entityId: item._id,
    newValue: item,
    req,
  });

  res.status(201).json({ success: true, data: item });
});

// PUT /api/items/:id
const updateItem = asyncHandler(async (req, res) => {
  const existing = await Item.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Item not found');

  const before = existing.toObject();
  const { name, sku, categoryId, quantity, status } = req.body;

  if (name !== undefined) existing.name = name;
  if (sku !== undefined) existing.sku = sku;
  if (categoryId !== undefined) existing.category = categoryId;
  if (quantity !== undefined) existing.quantity = quantity;
  if (status !== undefined) existing.status = status;
  await existing.save();

  await logAction({
    userId: req.user.id,
    action: 'ITEM_UPDATED',
    entityType: 'Item',
    entityId: existing._id,
    oldValue: before,
    newValue: existing,
    req,
  });

  res.json({ success: true, data: existing });
});

module.exports = { listItems, getItem, createItem, updateItem };
