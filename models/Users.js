const mongoose = require("mongoose")

// Created a schema for the User collection
const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
    
})

// Export a mongoose model for the 'user' collection based on the userSchema
module.exports = mongoose.model("user", userSchema)