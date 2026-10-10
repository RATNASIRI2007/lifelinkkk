const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: { values: BLOOD_GROUPS, message: 'Blood group must be one of ' + BLOOD_GROUPS.join(', ') },
      index: true,
    },
    location: { type: String, required: [true, 'Location is required'], trim: true, maxlength: 120 },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      match: [/^[+]?[\d\s-]{7,15}$/, 'Enter a valid phone number (7-15 digits)'],
    },
    available: { type: Boolean, default: true },
    lastDonated: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

donorSchema.statics.BLOOD_GROUPS = BLOOD_GROUPS;

module.exports = mongoose.model('Donor', donorSchema);
