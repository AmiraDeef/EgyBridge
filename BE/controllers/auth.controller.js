const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { registerSchema, loginSchema } = require('./validations/authValidation')


const register = async (req, res,next) => {
    try {
        const { error, value } = registerSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message)
            })
        }
        console.log(value);

        const { fullName, email, password, phone, country } = value
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "pls enter another email"
            })
        }

        // confirmPassword equality is already enforced by Joi (valid(joi.ref('password')))

        const hashPass = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullName, email, password: hashPass, phone, country
        })
        return res.status(201).json({
            message: `${fullName} created successfuly`
        })

    } catch (error) {
       next(error)

    }




}
const login = async (req, res,next) => {
    try {
        const { error, value } = loginSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message)
            })
        }
        const { email, password } = value

        const existUser = await User.findOne({ email })
        if (!existUser) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        const isMatch = await bcrypt.compare(password, existUser.password)
        if (!isMatch) return res.status(400).json({ message: "invliad password" })
        const token = jwt.sign(
            { id: existUser._id, role: existUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        return res.status(200).json({
            message: "login success",
            token,
            user: {
                id: existUser._id,
                fullName: existUser.fullName,
                email: existUser.email,
                role: existUser.role,
            },
        })


    } catch (error) {
        next(error)
    }

}

const logout = async (req, res,next) => {
    try {
    
      return res.status(200).json({
        message:"logout success"
      })

    } catch (error) {
            next(error)

    }




}

module.exports = { register, login, logout }