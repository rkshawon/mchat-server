const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')


const { body, validationResult } = require('express-validator');

router.post("/register",
    body('name').notEmpty().withMessage("Username can not be empty"),
    body('email').isEmail().withMessage("Not a valid Email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    async (req, res)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty())
        res.status(400).json(errors.array());
    else{
        const salt = await bcrypt.genSalt(10)
        const hassedPassword = await bcrypt.hash(req.body.password, salt)
        const data = new User({
            name: req.body.name,
            email: req.body.email,
            password: hassedPassword,
        })
        try{
            const user =  await data.save()
            res.status(200).json(user)
        }catch(err){
            res.status(500).json(err)
    }
    }
})

router.post("/login", async (req, res)=>{
    try {
        const user = await User.findOne({ email: req.body.email });
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        const { password, ...data} = user._doc
        if(!validPassword)
             res.status(400).json({pass: false})
        else
             res.status(200).json(data)
            
      } catch (err) {
        res.status(500).json(err)
    }
})
router.get("/:userid", async (req, res)=>{
    const data = await User.findById(req.params.userid)
    try{
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router
