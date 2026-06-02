const mongoose = require('mongoose');

const jobAlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    keywords: { type: String, default: '' },
    type: { type: String, default: '' },
    experience: { type: String, default: '' },
    location: { type: String, default: '' },
    salaryMin: { type: Number },
    emailNotify: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobAlert', jobAlertSchema);
