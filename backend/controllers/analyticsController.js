const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

const getAnalytics = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const jobFilter = isAdmin ? {} : { postedBy: req.user._id };
    const jobIds = await Job.find(jobFilter).distinct('_id');
    const appFilter = isAdmin ? {} : { job: { $in: jobIds } };

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus,
      jobsByType,
      recentApplications,
    ] = await Promise.all([
      Job.countDocuments(jobFilter),
      Job.countDocuments({ ...jobFilter, isActive: true }),
      Application.countDocuments(appFilter),
      Application.aggregate([
        { $match: appFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: jobFilter },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Application.find(appFilter)
        .populate('applicant', 'name')
        .populate('job', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    let adminStats = {};
    if (isAdmin) {
      adminStats = {
        totalUsers: await User.countDocuments(),
        jobseekers: await User.countDocuments({ role: 'jobseeker' }),
        employers: await User.countDocuments({ role: 'employer' }),
      };
    }

    res.json({
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus,
      jobsByType,
      recentApplications,
      adminStats,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics };
