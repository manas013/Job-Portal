const JobAlert = require('../models/JobAlert');
const User = require('../models/User');
const sendEmail = require('./sendEmail');
const createNotification = require('./createNotification');

const jobMatchesAlert = (job, alert) => {
  let match = true;
  if (alert.keywords) {
    const re = new RegExp(alert.keywords, 'i');
    match =
      match &&
      (re.test(job.title) || re.test(job.description) || job.skills?.some((s) => re.test(s)));
  }
  if (alert.type && alert.type !== job.type) match = false;
  if (alert.experience && alert.experience !== job.experience) match = false;
  if (alert.location && !job.location.toLowerCase().includes(alert.location.toLowerCase())) {
    match = false;
  }
  if (alert.salaryMin && (!job.salary?.min || job.salary.min < alert.salaryMin)) match = false;
  return match;
};

const notifyAlertMatch = async (job, alert) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const jobUrl = `${clientUrl}/jobs/${job._id}`;

  await createNotification({
    userId: alert.user,
    type: 'job_alert',
    title: 'New job matches your alert',
    message: `${job.title} at ${job.company}`,
    link: `/jobs/${job._id}`,
  });

  if (alert.emailNotify) {
    const user = await User.findById(alert.user);
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `New job alert: ${job.title}`,
        html: `
          <h2>A new job matches your alert</h2>
          <p><strong>${job.title}</strong> at ${job.company}</p>
          <p>${job.location} · ${job.type} · ${job.experience}</p>
          <p><a href="${jobUrl}">View job & apply</a></p>
        `,
      });
    }
  }
};

const checkAlertsForJob = async (job) => {
  const alerts = await JobAlert.find({ isActive: true, emailNotify: { $ne: false } });
  for (const alert of alerts) {
    if (jobMatchesAlert(job, alert)) {
      await notifyAlertMatch(job, alert);
    }
  }
};

module.exports = { checkAlertsForJob, jobMatchesAlert, notifyAlertMatch };
