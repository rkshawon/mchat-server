const mongoose = require("mongoose")

const conversationsSchema = new mongoose.Schema({
    members: {
        type: Array,
    },
}, {timestamps: true})

const conversation = mongoose.model("conversations", conversationsSchema)

module.exports = conversation