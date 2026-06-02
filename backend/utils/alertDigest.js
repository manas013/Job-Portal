const Job = require('../models/Job');
const JobAlert = require('../models/JobAlert');
const User = require('../models/User');
const sendEmail = require('./sendEmail');
const { jobMatchesAlert } = require('./processJobAlerts');

const runAlertDigest = async () => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newJobs = await Job.find({ isActive: true, createdAt: { $gte: since } });
    if (!newJobs.length) return;

    const alerts = await JobAlert.find({ isActive: true, emailNotify: true });
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    for (const alert of alerts) {
      const matches = newJobs.filter((job) => jobMatchesAlert(job, alert));
      if (!matches.length) continue;

      const user = await User.findById(alert.user);
      if (!user?.email) continue;

      const list = matches
        .map(
          (j) =>
            `<li><a href="${clientUrl}/jobs/${j._id}">${j.title}</a> at ${j.company} (${j.location})</li>`
        )
        .join('');

      await sendEmail({
        to: user.email,
        subject: `${matches.length} new job(s) match your alert`,
        html: `<h2>Your daily job alert digest</h2><ul>${list}</ul>`,
      });

      console.log(`Alert digest sent to ${user.email} (${matches.length} jobs)`);
    }
  } catch (err) {
    console.error('Alert digest error:', err.message);
  }
};

module.exports = runAlertDigest;
