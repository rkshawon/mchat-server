const mongoose = require("mongoose")

const messagesSchema = new mongoose.Schema({
    conversationId:{
        type: String
    },
    senderId:{
        type: String
    },
    text:{
        type: String
    }
}, {timestamps: true})

const message = mongoose.model("messages", messagesSchema)

module.exports = message