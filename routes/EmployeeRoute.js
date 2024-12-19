const express = require('express')
const router = express.Router();
const employee = require('../controllers/EmployeeController')
const imageUpload = require('../middleware/UploadImage')
const authenticate = require('../middleware/authenticate')

router.get('/getAllEmployee', authenticate ,employee.getAllEmployee)
// commented route is used when we have to remove the image upload section from the add Employee api
// router.post('/addEmployee',employee.addEmployee)

// if there is single file to upload use this method
// router.post('/addEmployee',imageUpload.single('profilePic[]'),employee.addEmployee)
// else 
router.post('/addEmployee',imageUpload.array('profilePic[]'),employee.addEmployee)

router.get('/getEmployeeById/:employeeId',authenticate,employee.employeeById)
router.patch('/updateEmployee',authenticate,employee.updateEmployee)
router.delete('/deleteEmployeeById/:employeeId',authenticate,employee.deleteEmployeeById)

module.exports= router