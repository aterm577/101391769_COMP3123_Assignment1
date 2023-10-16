const express = require("express")
const UserModel = require("../models/Users")
const jwt = require("jsonwebtoken")


// Created an 'express.Router()' to define routes
const routes = express.Router()

// Defined a route for allowing user to create s new account (signup)
routes.post("/signup", async (req, res) => {

    console.log(req.body)

    try{

        // Check if the request body is empty
        if(!req.body){
            return res.status(500).json({
                status: false,
                message: "User data required as a JSON body"
            })
        }

        const newUser = new UserModel({
            ...req.body
        })

        // Save the new user to the database
        await newUser.save()

        res.status(201).json({
            message: "User created successfully!",
            user: newUser
        })
    } catch(error){
        res.status(500).send(error)
    }

})

// Defined a route for allowing user to acess the system (login)
routes.post("/login", async (req, res) => {

    const { username, password } = req.body

    // Search for a user with the given username in the database
    const user = await UserModel.findOne({ username })

    if (user) {
        
        const secretKey = "fb00db72f4e72417dccb0b2e4c163b7b18240e3a4d83f9966d2059bf1ac2486e5376452caf5d6641ce64e827011b646d149e0d6e1bbd10c42d838e7152a7d731"
        const expiresIn = "1h" // Token expiration time (e.g., 1 hour)

        // Create a payload for the JWT token
        const payload = { username: user.username }

        const token = jwt.sign(payload, secretKey, { expiresIn })

        res.status(200).json({
            status: true,
            username: user.username,
            message: "User logged in successfully",
            jwt_token: token
        })

    } else {
        res.status(500).json({
            status: false,
            message: "Invalid Username and password"
        })
    } 
})
  
module.exports = routes

