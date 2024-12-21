const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuthRegisterSchema = new Schema({
    firstName:{type:String},
    lastName:{type:String},
    email:{type:String},
    phone:{type:String},
    password:{type:String},
    isVerified:{type:Boolean},
    otp:{type:Number}
    
},{timestamps:true}
)

const Register = mongoose.model('AuthRegisterSchema',AuthRegisterSchema)

module.exports = Register