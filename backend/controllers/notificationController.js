const Notification = require('../models/Notification');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'All marked as read' });
  } catch (err) {
    next(err);
  }
};

const markOneRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markRead, markOneRead };
