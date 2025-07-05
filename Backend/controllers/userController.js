const { getUsers, createUser, loginUser, createCustomer , getUserDetails , issuedBooks , userExists} = require('../models/userModel');
const bcrypt = require('bcrypt')
const { generateToken } = require("../utilities/generateToken")

const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUserController = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const user = await createUser(firstname, lastname, email, password);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'User already exists') {
      res.status(400).json({ error: 'User already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


const loginUserController = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await loginUser(email, password);
    let token = generateToken(user)
    res.cookie("token", token)
    res.status(201).json({ success: true });
  } catch (error) {
    if (error.message === 'invalid credentials') {
      res.status(400).json({ success : false });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const logoutUser = async function (req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
};


const createCustomerController = async (req, res) => {
  const { firstName, lastName, email, password } = req.body.formData;
  console.log(req.body.formData);
  try {
    const user = await createCustomer(firstName, lastName, email, password);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'User already exists') {
      res.status(400).json({ error: 'User already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const getUserController = async (req, res) => {
  try {
    const userid = req.params.userid;
    const book = await getUserDetails(userid);
    if (!book) {
      return res.status(404).json({ error: 'user not found' });
    }
    return res.status(200).json(book);
  } catch (err) {
    console.error('Error in database:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getIssuedBooks = async (req, res) => {
  const { userid } = req.params;
  try {
    const exist = await userExists(userid)
    if (!exist) {
      res.status(400).json({error : "User doesnt exist"});
    }else{
      const books = await issuedBooks(userid);
      res.status(200).json(books); // array of book objects
    }
  } catch (err) {
    console.error("Error in issuedBooksController:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  createUser: createUserController, // to create a admin
  createCustomer: createCustomerController, // to create a customer
  loginUser: loginUserController,
  logoutUser,
  getUserDetails : getUserController, // to get in issue book
  issuedBooks : getIssuedBooks, // to get data in return books
};