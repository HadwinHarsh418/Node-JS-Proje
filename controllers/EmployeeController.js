// Importing the Employee model
const Employee = require('../models/Employee');

// Function to get all employees from the database
const getAllEmployee = (req, res, next) => {
    // Query to find all employees
    if(req.query.page&&req.query.limit){
        Employee.paginate({},{page:req.query.page,limit:req.query.limit})
        .then(response => {
                    // Sending the list of all employees as a JSON response
                    res.json({ status:200,response,message:'Employee Data Fetched' });
                })
                .catch(error => {
                    // Sending an error message if something goes wrong
                    res.json({
                        message: 'An Error Occured'
                    });
                });

    }else{
        Employee.find()
            .then(response => {
                // Sending the list of all employees as a JSON response
                res.json({ response });
            })
            .catch(error => {
                // Sending an error message if something goes wrong
                res.json({
                    message: 'An Error Occured'
                });
            });

    }
};

// Function to get an employee by their ID
const employeeById = (req, res, next) => {
    // Getting the employeeId from the request body (should be from req.params or req.query, but here it is from req.body)
    let employeeId = req.params.employeeId;

    // Query to find the employee by ID
    Employee.findById(employeeId)
        .then(response => {
            // Sending the found employee as a JSON response
            res.json({ response });
        })
        .catch(error => {
            // Sending an error message if something goes wrong
            res.json({
                message: 'An Error Occured'
            });
        });
};

// Function to add a new employee to the database
const addEmployee = (req, res, next) => {
    // Check if an employee with the provided email already exists in the database
    Employee.findOne({ email: req.body.email })
        .then(existingEmployee => {
            if (existingEmployee) {
                // If an employee with the same email exists, send an error message
                return res.json({
                    status: 200,
                    message: 'Email already exists'
                });
            }

            // If the email doesn't exist, create a new employee object with the data from the request body
            let newEmployee = new Employee({
                name: req.body.name,
                desgignation: req.body.desgignation,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
            });

            // if there is single file to upload use this method

                // if(req.file){
                //     newEmployee.profilePic = req.file.path
                // }
            // else
            console.log(req.files);
            
            if(req.files){
                let path = '';
                req.files.forEach(function(files,index,arr){
                    path = path + files.path + ',';
                }
                );
                path = path.substring(0,path.lastIndexOf(','))
                    newEmployee.profilePic = path
            }
            
            // Save the new employee to the database
            newEmployee.save()
                .then(response => {
                    // Sending a success message after saving the new employee
                    res.json({ status: 200, message: 'Employee Added Successfully' });
                })
                .catch(error => {
                    // Sending an error message if the saving process fails
                    res.json({
                        status: 500,
                        message: 'An Error Occurred',
                        error: error.message
                    });
                });
        })
        .catch(error => {
            // Sending an error message if there is an issue while checking the email
            res.json({
                status: 500,
                message: 'An Error Occurred while checking the email',
                error: error.message
            });
        });
};

// Function to update an existing employee's information
const updateEmployee = (req, res, next) => {
    // Getting the employee ID from the request body
    let existingUser = req.body.employeeId;

    // Creating an object with the updated data
    let updateEmployee = {
        name: req.body.name,
        desgignation: req.body.desgignation,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
    };

    // Finding the employee by ID and updating their information
    Employee.findByIdAndUpdate(existingUser, { $set: updateEmployee })
        .then(response => {
            // Sending the updated employee information as a JSON response
            res.json({status:200,message:'Employee Updated Successfully'});
        })
        .catch(error => {
            // Sending an error message if something goes wrong
            res.json({
                message: 'An Error Occured'
            });
        });
};

// Function to delete an employee by their ID
const deleteEmployeeById = (req, res, next) => {
    // Getting the employee ID from the request body
    let existingUser = req.params.employeeId;

    // Finding the employee by ID and deleting them
    Employee.findOneAndDelete(existingUser)
        .then(response => {
            // Sending a success message if the employee is deleted
            res.json({ status:200,message: 'Employee Deleted Successfully' });
        })
        .catch(error => {
            // Sending an error message if something goes wrong
            res.json({
                status:500,
                message: 'An Error Occured'
            });
        });
};

// Exporting the functions to be used in other parts of the application
module.exports = {
    employeeById,
    getAllEmployee,
    updateEmployee,
    addEmployee,
    deleteEmployeeById,
};
