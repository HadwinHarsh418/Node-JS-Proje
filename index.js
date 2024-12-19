const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const EmployeeRoutes = require('./routes/EmployeeRoute')
const AuthRoutes = require('./routes/AuthRoute')
const dotenv = require('dotenv')
dotenv.config()
mongoose.connect(process.env.DATA_BASE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
const db = mongoose.connection

db.on('error',(err)=>{
    console.log(err);
    
})

db.once('open',()=>{
    console.log('Database Connected Successfully');
    
})

const app = express()

// app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use('/api',EmployeeRoutes)
app.use('/api/auth',AuthRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})