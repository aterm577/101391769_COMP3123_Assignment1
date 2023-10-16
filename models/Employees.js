const mongoose = require("mongoose")

// Created a schema for the Employee collection
const employeeSchema = new mongoose.Schema({

    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true
    },
    gender:{
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    salary:{
        type: Number,
        required: true
    }

})

// Export a mongoose model for the 'employee' collection based on the employeeSchema
module.exports = mongoose.model("employee", employeeSchema)