const express = require("express")
const EmployeeModel = require("../models/Employees")

// Created an 'express.Router()' to define routes
const routes = express.Router()

// Defined a route to get all employee list
routes.get("/employees", async (req, res) => {

    try{

        // Fetched a list of all employees from the database
        const employeeList = await EmployeeModel.find({})

        res.status(200).send({
            emploeeList: employeeList
        })

    }catch(error) {
        res.status(500).send(error)
    }
})

// Defined a route to create a new employee accounts
routes.post("/employees", async (req, res) => {

    try {

        // Extract employee data from the request body
        const { first_name, last_name, email, gender, salary } = req.body

        // Check if any required fields are missing in the request
        if (!first_name || !last_name || !email || !gender || !salary) {

            return res.status(500).json({
                status: false,
                message: "Employee data is incomplete. Please provide all required fields"
            })

        }
        
        // Creates a new employee with the provided data
        const newEmployee = new EmployeeModel({
            
            first_name,
            last_name,
            email,
            gender,
            salary

        })

        await newEmployee.save()

        res.status(201).json({
            message: "Employee added successfully!",
            employee: newEmployee
        })
    
    } catch (error) {
        res.status(500).send(error)
    }
})

// Defined a route to get employee details by employee id
routes.get("/employees/:eid", async (req, res) => {

    try {

        // Find an employee by their ID from the database
        const employee = await EmployeeModel.findById(req.params.eid)

        res.status(200).send({
            employee: employee
        })

    } catch (error) {
        res.status(500).send({message: "Employee with this id not found"})
    }

})

// Defined a route to update employee details
routes.put("/employees/:eid", async (req, res) => {

    const employeeId = req.params.eid

    try {

        // Find the original employee data
        const originalEmployee = await EmployeeModel.findById(employeeId)

        if (!originalEmployee) {
            res.status(500).json({ message: 'Employee not found' })
            return
        }

        // Define the allowed fields
        const allowedFields = ["first_name", "last_name", "email", "gender", "salary"]

        const updateData = {}

        const changes = {}

        for (const field in req.body) {
            if (allowedFields.includes(field)) {
                // Check if the field value is different from the original
                if (req.body[field] !== originalEmployee[field]) {
                    changes[field] = {
                        original: originalEmployee[field],
                        updated: req.body[field]
                    }
                }
                updateData[field] = req.body[field]
            } else {
                res.status(500).json({ message: "There is no such '${field}' fieled to update. You can only update: first_name, last_name, email, gender, and salary!"})
                return
            }
        }

        // Update the employee data with the allowed fields
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(employeeId, updateData, { new: true })

        if (!updatedEmployee) {
            res.status(500).json({ message: "Employee update failed"})
            return
        }

        // Send the response with the updated employee data and changes
        res.status(200).json({
            employee: updatedEmployee,
            changes: changes
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

// Defined a route to delete employee by employee id
routes.delete("/employees/:eid", async (req, res) => {

    try {
        if (req.params.eid === undefined) {
            res.status(500).json({
                status: false,
                message: "Employee ID required in path /employees/:eid"
            })
            return
        }

        const deletedEmployee = await EmployeeModel.findByIdAndDelete(req.params.eid)

        if (!deletedEmployee) {
            res.status(404).json({ message: "Employee not found" });
            return
        }

        res.status(204).json()

    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = routes