const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  roleId: objectId.optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const itemSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  categoryId: objectId.optional(),
  quantity: z.number().int().nonnegative().optional(),
});

const itemUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  categoryId: objectId.optional(),
  quantity: z.number().int().nonnegative().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

const purchaseSchema = z.object({
  supplierId: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: objectId,
        quantity: z.number().int().positive(),
        unitPrice: z.number().nonnegative(),
      })
    )
    .min(1),
});

const transferSchema = z.object({
  itemId: objectId,
  sourceLocationId: objectId,
  destinationLocationId: objectId,
  quantity: z.number().int().positive(),
});

const transferStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_TRANSIT', 'COMPLETED', 'REJECTED']),
});

const assignmentSchema = z.object({
  itemId: objectId,
  userId: objectId,
});

/**
 * Express middleware factory: validates req.body against a zod schema.
 * On failure, responds 400 with field-level error details.
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  validate,
  objectId,
  registerSchema,
  loginSchema,
  itemSchema,
  itemUpdateSchema,
  purchaseSchema,
  transferSchema,
  transferStatusSchema,
  assignmentSchema,
};
