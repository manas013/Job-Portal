const JobAlert = require('../models/JobAlert');
const { checkAlertsForJob } = require('../utils/processJobAlerts');

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await JobAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

const createAlert = async (req, res, next) => {
  try {
    const alert = await JobAlert.create({ ...req.body, user: req.user._id });
    res.status(201).json(alert);
  } catch (err) {
    next(err);
  }
};

const deleteAlert = async (req, res, next) => {
  try {
    const alert = await JobAlert.findOne({ _id: req.params.id, user: req.user._id });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    await alert.deleteOne();
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAlerts, createAlert, deleteAlert, checkAlertsForJob };
