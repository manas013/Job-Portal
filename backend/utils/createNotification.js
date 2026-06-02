const Notification = require('../models/Notification');

const createNotification = async ({ userId, type, title, message, link }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
    });
    const io = global.io;
    if (io) {
      io.to(userId.toString()).emit('notification', notification);
    }
    return notification;
  } catch (err) {
    console.error('Notification error:', err.message);
    return null;
  }
};

module.exports = createNotification;
