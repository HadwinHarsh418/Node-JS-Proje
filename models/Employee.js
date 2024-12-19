const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Pagination = require('mongoose-paginate-v2')


const employeeSchema = new Schema({
    name:{type:String},
    desgignation:{type:String},
    email:{type:String},
    phone:{type:String},
    age:{type:Number},
}, {timestamps:true})

employeeSchema.plugin(Pagination)
const Employee = mongoose.model('Employee',employeeSchema)
module.exports = Employee