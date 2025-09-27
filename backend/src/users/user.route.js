const express = require('express');
const router = express.Router();
const { syncUser, getUserProfile } = require('./user.controller');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');

router.post('/sync', syncUser);
router.get('/:uid', verifyFirebaseToken, getUserProfile);

module.exports = router;
