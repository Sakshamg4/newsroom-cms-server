// controllers/adminController.js
const User = require('../models/User');
const Article = require('../models/Article');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ role: 1, name: 1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.setRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Editor', 'Writer', 'Reader', 'Admin'].includes(role)) return res.status(400).json({ msg: 'Invalid role' });
    const u = await User.findById(req.params.userId);
    if (!u) return res.status(404).json({ msg: 'User not found' });
    u.role = role;
    await u.save();
    res.json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getApprovedArticles = async (req, res) => {
  try {
    const list = await Article.find({ status: 'Approved' }).populate('author', 'name email').populate('approvedBy', 'name');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
