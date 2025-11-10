const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const userCtrl = require('../controllers/userController');
const User = require('../models/User'); // we'll need this for the new endpoint


router.get('/list', auth, roles(['Admin', 'Editor']), userCtrl.list);

router.get('/editors', auth, roles(['Writer', 'Editor', 'Admin']), async (req, res) => {
  try {
    const editors = await User.find({ role: 'Editor' }).select('_id name email');
    res.json(editors);
  } catch (err) {
    console.error('GET /users/editors error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
