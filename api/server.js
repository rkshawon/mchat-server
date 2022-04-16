const express = require("express")
const mongoose = require('mongoose')
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const dotenv = require("dotenv")
const conversationRoute = require("./routes/Conversations")
const MessageRoute = require("./routes/Message")
const ueerRoute = require('./routes/Auth')
const allUeerRoute = require('./routes/Users')

dotenv.config()
app.use(express())
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
    process.env.MONGO_URL, ()=>{
        console.log("database connected")
    }
)
app.use("/api/auth", ueerRoute)
app.use("/api/conversation", conversationRoute)
app.use("/api/message", MessageRoute)
app.use("/api/allusers", allUeerRoute)

app.listen(process.env.PORT || 8000, ()=>{
    console.log("server is running at 8000");
})
