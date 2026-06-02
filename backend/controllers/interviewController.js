const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');
const createNotification = require('../utils/createNotification');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

const getMyInterviews = async (req, res, next) => {
  try {
    const filter =
      req.user.role === 'jobseeker'
        ? { seeker: req.user._id }
        : { employer: req.user._id };

    const interviews = await Interview.find(filter)
      .populate('job', 'title company location')
      .populate('seeker', 'name email avatar')
      .populate('employer', 'name email')
      .populate('application', 'status')
      .sort({ updatedAt: -1 });

    res.json(interviews);
  } catch (err) {
    next(err);
  }
};

const proposeInterview = async (req, res, next) => {
  try {
    const { applicationId, proposedSlots, notes } = req.body;
    const app = await Application.findById(applicationId).populate('job');
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const job = app.job;
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let interview = await Interview.findOne({ application: applicationId });
    const slots = proposedSlots.map((s) => ({
      start: new Date(s.start),
      end: new Date(s.end),
    }));

    if (interview) {
      interview.proposedSlots = slots;
      interview.notes = notes || interview.notes;
      interview.status = 'proposed';
      interview.selectedSlot = undefined;
      await interview.save();
    } else {
      interview = await Interview.create({
        application: applicationId,
        job: job._id,
        employer: req.user._id,
        seeker: app.applicant,
        proposedSlots: slots,
        notes: notes || '',
        status: 'proposed',
      });
    }

    await createNotification({
      userId: app.applicant,
      type: 'interview',
      title: 'Interview slots proposed',
      message: `Select a time for ${job.title}`,
      link: '/interviews',
    });

    const seeker = await User.findById(app.applicant);
    if (seeker?.email) {
      await sendEmail({
        to: seeker.email,
        subject: `Interview invitation: ${job.title}`,
        html: `<p>${req.user.name} proposed interview times for <strong>${job.title}</strong>. Log in to select a slot.</p>`,
      });
    }

    const populated = await Interview.findById(interview._id)
      .populate('job', 'title company')
      .populate('seeker', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

const selectInterviewSlot = async (req, res, next) => {
  try {
    const { slotId } = req.body;
    const interview = await Interview.findById(req.params.id).populate('job');
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.seeker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const slot = interview.proposedSlots.id(slotId);
    if (!slot) return res.status(400).json({ message: 'Invalid slot' });

    interview.selectedSlot = { start: slot.start, end: slot.end };
    interview.status = 'confirmed';
    await interview.save();

    await createNotification({
      userId: interview.employer,
      type: 'interview',
      title: 'Interview confirmed',
      message: `${req.user.name} confirmed an interview for ${interview.job.title}`,
      link: '/interviews',
    });

    res.json(interview);
  } catch (err) {
    next(err);
  }
};

const cancelInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    const isParty =
      interview.seeker.toString() === req.user._id.toString() ||
      interview.employer.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isParty) return res.status(403).json({ message: 'Not authorized' });

    interview.status = 'cancelled';
    await interview.save();
    res.json(interview);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyInterviews,
  proposeInterview,
  selectInterviewSlot,
  cancelInterview,
};
