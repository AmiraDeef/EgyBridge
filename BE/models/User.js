
const mongoose=require("mongoose")

const UserSchema=mongoose.Schema({
     fullName:{
        type:String,
        required:true,
        trim:true,
        
     },
     email:{
        type:String,
        required:true,
        trim:true,
        unique:true

     },password:{
        type:String,
        required:true,
        

     }
     ,country:{
        type:String,
        required:true,
        trim:true,
     },phone:{
        type:String,
        required:true

     }

},{timestamps:true})

const User=mongoose.model("User",UserSchema)

module.exports=User;