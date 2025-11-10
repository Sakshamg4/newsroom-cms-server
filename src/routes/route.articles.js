const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const articleCtrl = require('../controllers/articleController');

// public approved list & search
router.get('/approved', articleCtrl.getApproved);

// create (writer)
router.post('/create', auth, roles(['Writer','Editor','Admin']), articleCtrl.create);

// writer: own articles
router.get('/mine', auth, roles(['Writer','Editor','Admin']), articleCtrl.getMine);

// edit/resubmit
router.put('/:id', auth, roles(['Writer','Editor','Admin']), articleCtrl.update);

// editor: assigned queue
router.get('/assigned', auth, roles(['Editor','Admin']), articleCtrl.getAssigned);

// review action
router.post('/:id/review', auth, roles(['Editor','Admin']), articleCtrl.review);

// reviewed list
router.get('/reviewed', auth, roles(['Editor','Admin']), articleCtrl.getReviewed);

module.exports = router;
