const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => { // returns boolean
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
};

// Authenticate user by checking username and password match
const authenticatedUser = (username, password) => { // returns boolean
    // Find a user with matching username and password
    return users.some(user => user.username === username && user.password === password);
};


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

