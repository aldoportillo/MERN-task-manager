const dotenv = require("dotenv").config() //Essential: It makes sure that server.js can use the URI in the .env file
const express = require("express")
const connectDB = require('./config/connectDB')
const mongoose = require("mongoose")
const Task = require("./models/taskModel")
const taskRoutes = require('./routes/taskRoute')
const cors = require("cors")
const path = require("path")


const app = express()

const PORT = process.env.PORT || 5000 //Allows heroku to create port and if none place port 5000

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => console.log(err))

//Middleware: Function that can be slotted inside routes that have access to req objects and response objects and next function

app.use(express.json()) //Gives us data passed into body

app.use(express.urlencoded({extended: false})) //Gives data passed into form


app.use(cors({
    origin: ["http://localhost:3000/", "https://task-manager.onrender.com"]
})) //Optimize Cors to only accept requests from one origin

app.use("/api/tasks", taskRoutes) //Appends api/tasks in front of routes

//Deployment Code

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/build"))) //Targets build
    app.get("*", (req, res) => { //Creates Routes
        res.sendFile(
            path.resolve(__dirname, "../", "frontend", "build", "index.html") 
        )
    })
} else {
    //Routes
    app.get("/", (req, res) => {
        res.send("<h1>Home Page</h1>")
    })
}




//If you look at collections on mongoDB you will see that we have the title before the ? and a subfolder of tasks... the plural form of the schema is given to that subfolder'