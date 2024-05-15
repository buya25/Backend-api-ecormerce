const express = require('express')
const bcrypt = require('bcryptjs')
const { User } = require('../models/user')
const usersRouter = express.Router()
const jwt = require('jsonwebtoken')
const generateToken = require('../helper/jwt')

//http://localhost:3000/api/v1/users
usersRouter.get(`/`, async (req, res) => {
    const users = await User.find()

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
        } = req.body

        //I want to hash my password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(passwordHash, salt)

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
        })
        //save data to the database
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
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
                        isAdmin: user.isAdmin
                    },
                    secret,
                    { expiresIn: "7d" }
                )
                //get the token
                res.status(200).send({ user: user.email, token: token })
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
usersRouter.get(`/:id`, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash')
        //if user is not available respond
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
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
Delete user
*/
usersRouter.delete(`/:id`, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
});

module.exports = usersRouter
