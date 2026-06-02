const SavedJob = require('../models/SavedJob');

const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate({ path: 'job', populate: { path: 'postedBy', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(saved.map((s) => s.job).filter(Boolean));
  } catch (err) {
    next(err);
  }
};

const saveJob = async (req, res, next) => {
  try {
    const existing = await SavedJob.findOne({ user: req.user._id, job: req.params.jobId });
    if (existing) return res.status(400).json({ message: 'Job already saved' });
    await SavedJob.create({ user: req.user._id, job: req.params.jobId });
    res.status(201).json({ message: 'Job saved' });
  } catch (err) {
    next(err);
  }
};

const unsaveJob = async (req, res, next) => {
  try {
    await SavedJob.deleteOne({ user: req.user._id, job: req.params.jobId });
    res.json({ message: 'Job removed from saved' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSavedJobs, saveJob, unsaveJob };
