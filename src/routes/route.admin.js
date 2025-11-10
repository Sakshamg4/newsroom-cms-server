const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const adminCtrl = require('../controllers/adminController');

router.use(auth, roles(['Admin']));

router.get('/users', adminCtrl.getAllUsers);
router.post('/role/:userId', adminCtrl.setRole);
router.get('/approved-articles', adminCtrl.getApprovedArticles);

module.exports = router;
