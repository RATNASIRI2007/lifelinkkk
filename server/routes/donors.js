const express = require('express');
const Donor = require('../models/Donor');
const { protect, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

const router = express.Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pick = (body) => {
  const { name, bloodGroup, location, contact, available, lastDonated } = body;
  const data = { name, bloodGroup, location, contact, available, lastDonated: lastDonated || null };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  return data;
};

// Owner or admin only.
const canModify = (user, donor) => user.role === 'admin' || String(donor.createdBy) === String(user._id);

// GET /api/donors/stats -> donor counts per blood group (public)
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const rows = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          total: { $sum: 1 },
          available: { $sum: { $cond: ['$available', 1, 0] } },
        },
      },
    ]);
    const byGroup = Object.fromEntries(rows.map((r) => [r._id, { total: r.total, available: r.available }]));
    const stats = Donor.BLOOD_GROUPS.map((g) => ({ bloodGroup: g, total: 0, available: 0, ...byGroup[g] }));
    res.json(stats);
  })
);

// GET /api/donors/mine -> donors added by the logged-in user
router.get(
  '/mine',
  protect,
  asyncHandler(async (req, res) => {
    const donors = await Donor.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(donors);
  })
);

// GET /api/donors?bloodGroup=O-&location=hyderabad&available=true&page=1&limit=12
// Public search. Contact numbers are only returned to logged-in users.
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { bloodGroup, location, available } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);

    const filter = {};
    if (bloodGroup) filter.bloodGroup = String(bloodGroup).replace(' ', '+'); // "+" can arrive as a space
    if (location) filter.location = new RegExp(escapeRegex(String(location).trim()), 'i');
    if (available === 'true') filter.available = true;

    const [items, total] = await Promise.all([
      Donor.find(filter)
        .sort({ available: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Donor.countDocuments(filter),
    ]);

    const donors = req.user ? items : items.map(({ contact, ...rest }) => rest);
    res.json({ donors, total, page, pages: Math.max(Math.ceil(total / limit), 1), contactVisible: Boolean(req.user) });
  })
);

// GET /api/donors/:id
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  })
);

// POST /api/donors
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const donor = await Donor.create({ ...pick(req.body), createdBy: req.user._id });
    res.status(201).json(donor);
  })
);

// PUT /api/donors/:id
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    if (!canModify(req.user, donor)) return res.status(403).json({ message: 'You can only edit donors you added' });
    donor.set(pick(req.body));
    await donor.save();
    res.json(donor);
  })
);

// DELETE /api/donors/:id
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    if (!canModify(req.user, donor)) return res.status(403).json({ message: 'You can only delete donors you added' });
    await donor.deleteOne();
    res.json({ message: 'Donor deleted' });
  })
);

module.exports = router;
