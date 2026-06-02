const Job = require('../models/Job');

const expireJobs = async () => {
  const result = await Job.updateMany(
    { isActive: true, deadline: { $lt: new Date() } },
    { $set: { isActive: false } }
  );
  if (result.modifiedCount > 0) {
    console.log(`Deactivated ${result.modifiedCount} expired job(s)`);
  }
};

module.exports = expireJobs;
