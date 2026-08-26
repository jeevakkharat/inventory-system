const { verifyToken } = require('../utils/jwt');
const { ApiError } = require('../utils/apiError');
const User = require('../models/User');

/**
 * Verifies the Bearer token on the Authorization header, loads the current
 * user + role from MongoDB, and attaches it to req.user.
 * Rejects deactivated accounts even if the token is still valid.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, 'Authentication token missing');
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.sub).populate('role');

    if (!user || user.status !== 'ACTIVE') {
      throw new ApiError(401, 'Invalid or inactive user');
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role.name,
    };

    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = { authenticate };
