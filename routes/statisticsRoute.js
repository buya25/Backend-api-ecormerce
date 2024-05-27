const express = require('express');
const { getInventoryStatistics } = require('../controller/statisticsController');
const router = express.Router();

// Define the route
router.get('/inventory', getInventoryStatistics);

module.exports = router;