const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
      required: true,
    },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true }
);

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    coverLetter: { type: String, default: '' },
    expectedSalary: { type: Number },
    resumeUrl: { type: String, default: '' },
    employerNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
