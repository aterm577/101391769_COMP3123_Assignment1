const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const usersRoutes = require("./routes/users")
const employeesRoutes = require("./routes/employees")


const app = express()

const SERVER_PORT = 3001

app.use(express.json())

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
})


const DB_CONNECTION_STRING = "mongodb+srv://adina:i4MGbunACfNmFqiL@cluster0.rxtsloq.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority"

// Connected to the MongoDB database using Mongoose
mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the application on a database connection error
})

app.use("/api/v1/user", usersRoutes)
app.use("/api/v1/emp", employeesRoutes)

app.listen(SERVER_PORT, () =>{
    console.log(`Server running at http://localhost:${SERVER_PORT}/`)
})