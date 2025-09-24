const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getAuthorContent,
  upsertAuthorContent
} = require('./author.controller');

router.get('/', getAuthorContent);
router.post('/', upload.fields([
  { name: 'motifImage', maxCount: 1 },
  { name: 'rightImage', maxCount: 1 },
  { name: 'leftImage', maxCount: 1 },
]), upsertAuthorContent);

module.exports = router;
