const express = require('express');
const User = require('../models/User');
const Donor = require('../models/Donor');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

const router = express.Router();
router.use(protect, authorize('admin'));

// GET /api/admin/summary
router.get(
  '/summary',
  asyncHandler(async (_req, res) => {
    const [users, donors, availableDonors] = await Promise.all([
      User.countDocuments(),
      Donor.countDocuments(),
      Donor.countDocuments({ available: true }),
    ]);
    res.json({ users, donors, availableDonors });
  })
);

// GET /api/admin/users
router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    const counts = await Donor.aggregate([{ $group: { _id: '$createdBy', n: { $sum: 1 } } }]);
    const byUser = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    res.json(
      users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        donorCount: byUser[String(u._id)] || 0,
      }))
    );
  })
);

// GET /api/admin/donors -> every donor record (admin management view)
router.get(
  '/donors',
  asyncHandler(async (_req, res) => {
    const donors = await Donor.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
    res.json(donors);
  })
);

// PATCH /api/admin/users/:id/role   { role: "admin" | "user" }
router.patch(
  '/users/:id/role',
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Role must be user or admin' });
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  })
);

// DELETE /api/admin/users/:id  (also removes the donors they added)
router.delete(
  '/users/:id',
  asyncHandler(async (req, res) => {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Donor.deleteMany({ createdBy: user._id });
    await user.deleteOne();
    res.json({ message: 'User and their donor records deleted' });
  })
);

module.exports = router;
