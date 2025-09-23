// backend/author/author.route.js
const express = require('express');
const router = express.Router();

const authorController = require('./author.controller');

// GET /api/author - get author content
router.get('/', authorController.getAuthorContent);

// PUT /api/author - update author content
router.put('/', authorController.updateAuthorContent);

module.exports = router;
