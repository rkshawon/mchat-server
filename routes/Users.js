const express = require("express")
const route = express.Router()
const User = require("../models/User")

route.get('/', async (req, res)=>{
    const alluser = await User.find()
    try {
        res.status(200).json(alluser);
    } catch (err) {
        res.status(500).json(err);
    }
})
route.put('/:updateuser', async (req, res)=>{
    const updateValue = await User.findByIdAndUpdate(req.params.updateuser,{firstTime: false})
    try {
        
        res.status(200).json(updateValue);
    } catch (err) {
        res.status(500).json(err);
    }
})
route.get('/:updateuser', async (req, res)=>{
    const updateValue = await User.findById(req.params.updateuser)
    try {
        
        res.status(200).json(updateValue);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = route