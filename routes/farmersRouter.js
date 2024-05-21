const express = require('express');
const { User } = require('../models/user');
const isAdmin = require('../helper/isAdmin');
const isLogin = require('../helper/isLogin');
const farmerRouter = express.Router();


// Changing a user or an Agent to a Farmer
farmerRouter.put('/:id', isLogin, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const { isFarmer } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        // If the user doesn't exist, return a 404 response
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the isFarmer field for the user
        user.isFarmer = isFarmer;

        // Save the updated user
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Changing a user or an Agent to a Farmer
farmerRouter.put('/:id', isLogin, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const { isFarmer } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        // If the user doesn't exist, return a 404 response
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the isFarmer field for the user
        user.isVerified = isVerified;

        // Save the updated user
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = farmerRouter;
