const mongoose = require("mongoose")

const newUser = mongoose.Schema({
    name:{
        type: String,
        required: true
    }, 
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        default: ''
    },
    firstTime:{
        type: Boolean,
        default: true
    }
}, {timestamps: true})

const user = mongoose.model("User", newUser)
module.exports = user