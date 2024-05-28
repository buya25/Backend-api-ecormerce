const express = require('express');
const router = express.Router();
const { getStartOfDay, getStartOfWeek, getStartOfMonth, getStartOfYear } = require('../utils/dateHelpers');
const { User } = require('../models/user');
const { getCustomerStatistics } = require('../controller/customerController');

// Endpoint to get the number of new customers
router.get('/new-customers', async (req, res) => {
    try {
        const now = new Date();
        
        const startOfDay = getStartOfDay(now);
        const startOfWeek = getStartOfWeek(now);
        const startOfMonth = getStartOfMonth(now);
        const startOfYear = getStartOfYear(now);

        const [dayCount, weekCount, monthCount, yearCount] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: startOfDay } }),
            User.countDocuments({ createdAt: { $gte: startOfWeek } }),
            User.countDocuments({ createdAt: { $gte: startOfMonth } }),
            User.countDocuments({ createdAt: { $gte: startOfYear } }),
        ]);

        res.json({ dayCount, weekCount, monthCount, yearCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/customers', getCustomerStatistics);

module.exports = router;