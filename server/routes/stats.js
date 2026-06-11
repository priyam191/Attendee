const express = require('express');
const router = express.Router();
const { getStats } = require('../middlewares/responseTime');

// Public endpoint for demo – returns API response time metrics
router.get('/', (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats' });
  }
});

module.exports = router;
