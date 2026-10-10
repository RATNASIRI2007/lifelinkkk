// Usage: npm run seed   (WARNING: clears the users and donors collections)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Donor = require('../models/Donor');

const donors = [
  ['Aarav Reddy', 'O-', 'Hyderabad', '9876500001', true],
  ['Meera Nair', 'A+', 'Hyderabad', '9876500002', true],
  ['Rohan Sharma', 'B+', 'Secunderabad', '9876500003', true],
  ['Sana Fatima', 'AB+', 'Hyderabad', '9876500004', false],
  ['Karthik Rao', 'O+', 'Warangal', '9876500005', true],
  ['Priya Das', 'A-', 'Bengaluru', '9876500006', true],
  ['Imran Khan', 'B-', 'Chennai', '9876500007', true],
  ['Ananya Iyer', 'AB-', 'Hyderabad', '9876500008', true],
  ['Vikram Singh', 'O+', 'Delhi', '9876500009', true],
  ['Lakshmi Devi', 'A+', 'Vijayawada', '9876500010', false],
  ['Arjun Mehta', 'B+', 'Mumbai', '9876500011', true],
  ['Neha Gupta', 'O-', 'Pune', '9876500012', true],
];

(async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Donor.deleteMany({})]);

  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'Admin@123', role: 'admin' });
  const user = await User.create({ name: 'Demo User', email: 'user@example.com', password: 'User@123', role: 'user' });

  await Donor.insertMany(
    donors.map(([name, bloodGroup, location, contact, available], i) => ({
      name,
      bloodGroup,
      location,
      contact,
      available,
      lastDonated: available ? new Date(Date.now() - (30 + i * 12) * 86400000) : null,
      createdBy: i % 3 === 0 ? admin._id : user._id,
    }))
  );

  console.log('Seeded.\n  Admin: admin@example.com / Admin@123\n  User:  user@example.com / User@123');
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
