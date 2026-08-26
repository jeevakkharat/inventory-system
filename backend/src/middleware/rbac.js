const { ApiError } = require('../utils/apiError');

/**
 * Restricts a route to the given list of role names.
 * Must run after `authenticate` so req.user.role is populated.
 * Usage: router.post('/items', authenticate, authorize('Admin', 'Inventory Manager'), controller)
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}

module.exports = { authorize };
