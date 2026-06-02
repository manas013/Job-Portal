const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
