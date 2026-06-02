const Message = require('../models/Message');
const createNotification = require('../utils/createNotification');

const getConversations = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: -1 });

    const partners = new Map();
    messages.forEach((m) => {
      const partner =
        m.sender._id.toString() === req.user._id.toString() ? m.receiver : m.sender;
      if (!partners.has(partner._id.toString())) {
        partners.set(partner._id.toString(), {
          partner,
          lastMessage: m,
          unread: 0,
        });
      }
    });

    res.json(Array.from(partners.values()));
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, jobId } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      job: jobId,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    const io = global.io;
    if (io) io.to(receiverId.toString()).emit('message', populated);

    await createNotification({
      userId: receiverId,
      type: 'message',
      title: 'New message',
      message: `${req.user.name}: ${content.slice(0, 50)}`,
      link: `/messages/${req.user._id}`,
    });

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getConversations, getMessages, sendMessage };
