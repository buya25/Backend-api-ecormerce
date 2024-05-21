const express = require('express')
const bcrypt = require('bcryptjs')
const { User } = require('../models/user')
const usersRouter = express.Router()
const jwt = require('jsonwebtoken');
const LoginStats = require('../models/loginStats');
const DeletedUser = require('../models/deletedUser');
const isAdmin = require('../helper/isAdmin');
const isFarmer = require('../helper/isFarmer');

//http://localhost:3000/api/v1/users
usersRouter.get(`/`, isFarmer, async (req, res) => {
    const users = await User.find();

    if (!users) {
        return res.status(404).send({ message: 'Users not found' })
    }

    res.send(users)
})

/*
Create a user registration
*/
usersRouter.post(`/register`, async (req, res) => {
    try {
        const {
            name,
            email,
            passwordHash,
            street,
            apartment,
            city,
            zip,
            country,
            phone,
        } = req.body;

        //I want to hash my password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordHash, salt);

        const user = new User({
            name,
            email,
            hashedPassword,
            street,
            apartment,
            city,
            zip,
            country,
            phone,
        });
        //save data to the database
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

/*
Login using Credentials
Here we want user to be able to user email or username then password to login
*/
usersRouter.post(`/login`, async (req, res) => {
    //send a response to the user for success or else fail
    try {
        //get the token string
        const secret = process.env.SECRET;
        //capture the value given is a username or email
        const { email, password } = req.body;
        //check if the user is available first
        const user = await User.findOne({ email });
        if (user) {
            //compare it with the password to accept the user
            const validPassword = await bcrypt.compare(
                password,
                user.hashedPassword
            )
            if (validPassword) {
                //create a token
                const token = jwt.sign(
                    {
                        userId: user.id,
                        username: user.name,
                        isFarmer: user.isFarmer,
                        isAdmin: user.isAdmin
                    },
                    secret,
                    { expiresIn: "7d" }
                );

                // Record login stats
                const loginstats = await LoginStats.create({
                    userId: user.id,
                    username: user.name,
                    loginTime: new Date()
                });

                //get the token
                res.status(200).send({ user: user.email, name: user.name, token: token })
            } else {
                res.status(400).send('Invalid Credentials')
            }
        } else {
            res.status(400).send('Invalid Credentials')
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

/*
How to load user details using /:id excluding the passwordHash
*/
usersRouter.delete(`/:id`, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Extract the JWT token from the request headers or cookies
        const token = req.headers.authorization.split(' ')[1]; // Assuming the token is in the format "Bearer <token>"
        // const token = req.cookies.jwt; // If using cookies for token storage
        
        // Decode the token to retrieve user information
        const decodedToken = jwt.verify(token, process.env.SECRET);
        
        // Check if the decoded token contains user information
        if (!decodedToken || !decodedToken.userId) {
            return res.status(401).send('Unauthorized');
        }
        
        
        // Ensure that the user performing the deletion matches the user from the token
        if (decodedToken.userId === userId) {
            return res.status(403).send('Forbidden, You cannot delete this account');
        }
        
        // Find the user to be deleted
        const user = await User.findById(userId);
        
        // If the user doesn't exist, return a 404 response
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Capture the name of the user to be deleted
        const deletedUserName = user.name; // Assuming the name field exists in your User schema
        
        
        // Capture the name of the person who is deleting the user
        const deletedBy = {
            userId: decodedToken.userId,
            username: decodedToken.username
        }; // Assuming the username is stored in the token

        
        // Delete the user
        await User.findByIdAndDelete(userId);
        
        // Save the deleted user information to the DeletedUser collection
        await DeletedUser.create({
            deletedUserName: deletedUserName,
            deletedBy: deletedBy
        });

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});
/*
    Get User /:Count
*/
usersRouter.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments()

    if (!userCount) {
        return res.status(404).send({ message: 'User not found' })
    }
    res.send({
        userCount: userCount,
    })
});


/*
Get the total number of login per hour, day, week, month
*/
// Define a route handler for GET requests to '/get/loginStats'
usersRouter.get(`/get/loginStats`, isAdmin, async (req, res) => {
    // Get the current date and time
    const date = new Date();

    // Calculate the start date of the last day
    const lastDay = new Date(date.setHours(0, 0, 0, 0));

    // Calculate the start date of the last week
    const lastWeek = new Date(date.setHours(0, 0, 0, 0));
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Calculate the start date of the last month
    const lastMonth = new Date(date.setHours(0, 0, 0, 0));
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Calculate the start date of the last year
    const lastYear = new Date(date.setHours(0, 0, 0, 0));
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    // Aggregate login statistics for the last 7 days
    const last7Days = await User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: lastWeek,
                },
            },
        },
        {
            $project: {
                _id: 0,
                day: { $dayOfMonth: '$createdAt' },
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' },
            },
        },
        {
            $group: {
                _id: { day: '$day', month: '$month', year: '$year' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                day: '$_id.day',
                month: '$_id.month',
                year: '$_id.year',
                count: '$count',
            },
        },
        {
            $sort: {
                year: -1,
                month: -1,
                day: -1,
            },
        },
        {
            $limit: 7,
        },
    ]);
    console.log('Last 7 days login statistics:', last7Days);

    // Aggregate login statistics for the last 30 days
    const last30Days = await User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: lastMonth,
                },
            },
        },
        {
            $project: {
                _id: 0,
                day: { $dayOfMonth: '$createdAt' },
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' },
            },
        },
        {
            $group: {
                _id: { day: '$day', month: '$month', year: '$year' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                day: '$_id.day',
                month: '$_id.month',
                year: '$_id.year',
                count: '$count',
            },
        },
        {
            $sort: {
                year: -1,
                month: -1,
                day: -1,
            },
        },
        {
            $limit: 30,
        },
    ]);

    // Send the login statistics as response
    console.log('Last 30 days login statistics:', last30Days);
});

/*
 Verify isFarmers
*/


module.exports = usersRouter
