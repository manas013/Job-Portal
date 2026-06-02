const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const { createApplication } = require('./applicationController');
const { checkAlertsForJob } = require('../utils/processJobAlerts');
const expireJobs = require('../utils/expireJobs');
const { rankJobsForUser, calcMatchScore, generateCoverLetter } = require('../utils/matchScore');

const buildSort = (sort) => {
  switch (sort) {
    case 'salary-desc':
      return { 'salary.max': -1, createdAt: -1 };
    case 'salary-asc':
      return { 'salary.min': 1, createdAt: -1 };
    case 'deadline':
      return { deadline: 1, createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
};

// GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    await expireJobs();
    const {
      search,
      type,
      experience,
      page = 1,
      limit = 10,
      sort,
      salaryMin,
      salaryMax,
      postedBy,
      mine,
    } = req.query;

    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (type) query.type = type;
    if (experience) query.experience = experience;
    if (salaryMin) query['salary.min'] = { $gte: Number(salaryMin) };
    if (salaryMax) query['salary.max'] = { ...query['salary.max'], $lte: Number(salaryMax) };
    if (postedBy) query.postedBy = postedBy;
    if (mine === 'true' && req.user) query.postedBy = req.user._id;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOpt = buildSort(sort);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'name email')
        .sort(sortOpt)
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    await checkAlertsForJob(job);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (err) {
    next(err);
  }
};

const applyJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.isActive) return res.status(400).json({ message: 'Job is no longer active' });

    const app = await createApplication(job, req.user, req.body);
    res.status(201).json({ message: 'Application submitted', application: app });
  } catch (err) {
    if (err.statusCode === 400) return res.status(400).json({ message: err.message });
    next(err);
  }
};

const getRecommendedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const appliedIds = await Application.find({ applicant: req.user._id }).distinct('job');
    const jobs = await Job.find({ isActive: true }).limit(50);
    const ranked = rankJobsForUser(user, jobs, appliedIds.map(String)).slice(0, 12);
    res.json(ranked);
  } catch (err) {
    next(err);
  }
};

const getJobMatchScore = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const user = await User.findById(req.user._id);
    const score = calcMatchScore(user, job);
    res.json({ matchScore: score, jobId: job._id });
  } catch (err) {
    next(err);
  }
};

const generateJobCoverLetter = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const user = await User.findById(req.user._id);
    const coverLetter = generateCoverLetter(user, job);
    res.json({ coverLetter });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getJobs,
  getJob,
  getRecommendedJobs,
  getJobMatchScore,
  generateJobCoverLetter,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
};
