const User = require('../models/User');
const Job = require('../models/Job');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('company');
  res.json(user);
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, phone, location, skills } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (skills) user.skills = skills;
    const updated = await user.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const resumeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl },
      { new: true }
    );
    res.json({ resumeUrl: user.resumeUrl });
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    res.json({ avatar: user.avatar });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const adminDeleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.deleteOne();
    res.json({ message: 'Job deleted by admin' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  uploadAvatar,
  getUsers,
  toggleUserActive,
  adminDeleteJob,
};
