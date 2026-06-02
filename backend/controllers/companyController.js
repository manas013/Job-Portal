const Company = require('../models/Company');
const Job = require('../models/Job');
const User = require('../models/User');

const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    res.json(company || null);
  } catch (err) {
    next(err);
  }
};

const upsertCompany = async (req, res, next) => {
  try {
    const { name, logo, website, description, location } = req.body;
    let company = await Company.findOne({ owner: req.user._id });
    if (company) {
      Object.assign(company, { name, logo, website, description, location });
      await company.save();
    } else {
      company = await Company.create({
        owner: req.user._id,
        name,
        logo,
        website,
        description,
        location,
      });
      await User.findByIdAndUpdate(req.user._id, { company: company._id });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
};

const uploadCompanyLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const logo = `/uploads/${req.file.filename}`;
    let company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(400).json({ message: 'Create company profile first (add company name)' });
    }
    company.logo = logo;
    await company.save();
    res.json({ logo: company.logo, company });
  } catch (err) {
    next(err);
  }
};

const getCompanyPublic = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('owner', 'name');
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const jobs = await Job.find({ postedBy: company.owner, isActive: true })
      .select('title company location type experience salary skills createdAt')
      .sort({ createdAt: -1 });

    res.json({ company, jobs });
  } catch (err) {
    next(err);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('owner', 'name email');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyCompany,
  upsertCompany,
  uploadCompanyLogo,
  getCompanyPublic,
  getCompanyById,
};
