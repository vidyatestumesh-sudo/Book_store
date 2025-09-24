const express = require('express');
const router = express.Router();
const { upsertAuthorContent, getAuthorContent } = require('./author.controller');

router.post('/author', async (req, res) => {
  try {
    const content = req.body; // Validate as needed!
    const result = await upsertAuthorContent(content);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save author content' });
  }
});

router.get('/author', async (req, res) => {
  try {
    const content = await getAuthorContent();
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve author content' });
  }
});

module.exports = router;
