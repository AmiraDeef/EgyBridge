const joi=require("joi")


const registerSchema=joi.object({
    fullName:joi.string().min(10).max(100).required(),
    email:joi.string().email().required(),
    phone:joi.string().regex(/^[0-9]{11}$/).required(),
    password:joi.string().min(6).max(30).required(),
    confirmPassword:joi.string().required().valid(joi.ref('password')),
    country:joi.string().min(4).max(40).required()
})

const loginSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(6).max(30).required()
})

module.exports={registerSchema,loginSchema}