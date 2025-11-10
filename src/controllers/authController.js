const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log(req.body);

    if (!email || !password) return res.status(400).json({ msg: 'Email/password required' });

    let user = await User.findOne({ email });

    console.log(user);

    if (user) return res.status(400).json({ msg: 'Email exists' });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed, role: role || 'Reader' });
    await user.save();

    console.log(user, "Testing");

    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register Error: ",err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    if (!email || !password) return res.status(400).json({ msg: 'Email/password required' });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);

    console.log(user);
    

    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {

    console.error("Login Error: ",err);
    res.status(500).json({ msg: 'Server error' });
  }
};