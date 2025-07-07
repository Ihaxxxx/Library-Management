const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a user 
router.post('/createuser', userController.createUser);

// Get All users
router.get('/getusers',userController.getUsers)

// Get single user
router.get('/getspecificuser/:userid',userController.getSpecificUser)

// route to login a user
router.post('/loginuser', userController.loginUser);

// route to logout the user
router.post('/logout', userController.logoutUser);

// route to create the customer
router.post('/createcustomer', userController.createCustomer);

// get user 
router.get("/getuserdetails/:userid",userController.getUserDetails)

// get users issued books
router.get('/getissuedbooks/:userid',userController.issuedBooks)


module.exports = router;
