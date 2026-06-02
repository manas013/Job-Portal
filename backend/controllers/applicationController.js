const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');
const sendEmail = require('../utils/sendEmail');

const pushStatusHistory = (app, status, userId, note = '') => {
  app.status = status;
  app.statusHistory.push({
    status,
    note,
    changedAt: new Date(),
    changedBy: userId,
  });
};

const getMyApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate({ path: 'job', populate: { path: 'postedBy', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

const getEmployerPipeline = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      const jobIds = await Job.find({ postedBy: req.user._id }).distinct('_id');
      query = { job: { $in: jobIds } };
    }

    query.status = { $ne: 'withdrawn' };

    const apps = await Application.find(query)
      .populate('job', 'title company location type')
      .populate('applicant', 'name email avatar bio skills resumeUrl')
      .sort({ updatedAt: -1 });

    res.json(apps);
  } catch (err) {
    next(err);
  }
};

const getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const apps = await Application.find({ job: job._id })
      .populate('applicant', 'name email avatar bio skills resumeUrl phone location')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, employerNotes } = req.body;
    const app = await Application.findById(req.params.id).populate('job');
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const job = app.job;
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status && status !== app.status) {
      pushStatusHistory(app, status, req.user._id, employerNotes || '');
    }
    if (employerNotes !== undefined) app.employerNotes = employerNotes;
    await app.save();

    await createNotification({
      userId: app.applicant,
      type: 'application_update',
      title: 'Application status updated',
      message: `Your application for "${job.title}" is now ${app.status}`,
      link: '/applications',
    });

    const populated = await Application.findById(app._id)
      .populate('job', 'title company')
      .populate('applicant', 'name email avatar');

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

const createApplication = async (job, user, body) => {
  const existing = await Application.findOne({ job: job._id, applicant: user._id });
  if (existing) throw Object.assign(new Error('Already applied'), { statusCode: 400 });

  const app = await Application.create({
    job: job._id,
    applicant: user._id,
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        note: 'Application submitted',
        changedAt: new Date(),
        changedBy: user._id,
      },
    ],
    coverLetter: body.coverLetter || '',
    expectedSalary: body.expectedSalary,
    resumeUrl: body.resumeUrl || user.resumeUrl || '',
  });

  if (!job.applicants.includes(user._id)) {
    job.applicants.push(user._id);
    await job.save();
  }

  const employer = await User.findById(job.postedBy);
  await createNotification({
    userId: job.postedBy,
    type: 'new_application',
    title: 'New application received',
    message: `${user.name} applied for ${job.title}`,
    link: '/pipeline',
  });

  if (employer?.email) {
    await sendEmail({
      to: employer.email,
      subject: `New applicant for ${job.title}`,
      html: `<p><strong>${user.name}</strong> applied for <strong>${job.title}</strong>.</p>`,
    });
  }
  if (user.email) {
    await sendEmail({
      to: user.email,
      subject: `Application submitted: ${job.title}`,
      html: `<p>Your application for <strong>${job.title}</strong> at ${job.company} was submitted.</p>`,
    });
  }

  return app;
};

const withdrawApplication = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).populate('job');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (['hired', 'withdrawn'].includes(app.status)) {
      return res.status(400).json({ message: 'Cannot withdraw this application' });
    }

    pushStatusHistory(app, 'withdrawn', req.user._id, 'Withdrawn by applicant');
    await app.save();

    await Job.findByIdAndUpdate(app.job._id, {
      $pull: { applicants: req.user._id },
    });

    res.json({ message: 'Application withdrawn', application: app });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyApplications,
  getEmployerPipeline,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
  createApplication,
};
