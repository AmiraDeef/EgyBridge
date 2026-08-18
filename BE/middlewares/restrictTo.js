// Role-based access guard. Use after authMiddleware, which sets req.userRole
// from the JWT payload (see controllers/auth.controller.js).
//
// Usage: router.post("/", authMiddleware, restrictTo("admin"), createPlace)
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = { restrictTo };
