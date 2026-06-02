const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'], default: 'full-time' },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
    },
    skills: [{ type: String, trim: true }],
    experience: { type: String, enum: ['entry', 'mid', 'senior', 'lead'], default: 'entry' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    deadline: { type: Date },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);
