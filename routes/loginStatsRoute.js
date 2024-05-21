const express = require('express');
const LoginStats = require("../models/loginStats");
const mongoose = require('mongoose');
const loginStatsRouter = express.Router()
/*
    Get login total /:Count
*/
loginStatsRouter.get(`/get/count`, async (req, res) => {
    try {
        const userLoginCount = await LoginStats.aggregate([
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);

        if (userLoginCount.length === 0) {
            return res.status(404).send({ message: 'No Record for login found' });
        }

        res.send({
            userLoginCount: userLoginCount[0].count
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


/*
Get login count of the user and incase the userId is repeated just make sure its only one
*/
loginStatsRouter.get(`/get/count/:userId`, async (req, res) => {
    try {
        const userId = req.params.userId;

        console.log(userId);
        const userLoginCount = await LoginStats.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);

        if (userLoginCount.length === 0) {
            return res.status(404).send({ message: 'No Record for login found' });
        }

        res.send({
            userLoginCount: userLoginCount[0].count
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/*
records of logins per hour 
*/
loginStatsRouter.get(`/loginsPerHour`, async (req, res) => {
    try {
        const loginsPerHour = await LoginStats.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$loginTime" },
                        month: { $month: "$loginTime" },
                        day: { $dayOfMonth: "$loginTime" },
                        hour: { $hour: "$loginTime" }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log(loginsPerHour);
        res.send({ loginsPerHour });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/*
Records of logins per week
*/
loginStatsRouter.get(`/loginsPerWeek`, async (req, res) => {
    try {
        const loginsPerWeek = await LoginStats.aggregate([
            {
                $group: {
                    _id: {
                        $week: "$loginTime"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.send({ loginsPerWeek });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/*
Records of logins per month
*/
loginStatsRouter.get(`/loginsPerMonth`, async (req, res) => {
    try {
        const loginsPerMonth = await LoginStats.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$loginTime' },
                        month: { $month: '$loginTime' },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);
        res.send({ loginsPerMonth });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/*
Records of Logins per year
*/
loginStatsRouter.get(`/loginsPerYear`, async (req, res) => {
    try {
        const loginsPerYear = await LoginStats.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$loginTime' },
                    },
                    count: { $sum: 1 },
                },
            },
        ])
        res.send({ loginsPerYear });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' })
    }
})



//exports
module.exports = loginStatsRouter;

