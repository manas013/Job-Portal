const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { _id: true }
);

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proposedSlots: [slotSchema],
    selectedSlot: slotSchema,
    status: {
      type: String,
      enum: ['proposed', 'confirmed', 'cancelled'],
      default: 'proposed',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
