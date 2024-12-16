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


regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
 
  if (!username || !password){
   return res.status(404).json({message:"username or password is missing"})
  }
  if (authenticatedUser(username,password)) {
   return res.status(300).json({message: "login successfully"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.session || !req.session.username) {
    return res.status(401).json({ message: 'User not logged in' });
  }
  const { isbn } = req.params;
  const {review} = req.query;
  const username = req.session.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  if (!review) {
    return res.status(400).json({ message: 'Review text is required.' });
  }

  const book = books[isbn];
  if(!book.review){
    book.review={}
  }
  const action = book.review[username] ? "updated" : "added";
  books.review[username] = review;
  return res.status(300).json(
    {message: `review ${action} successfully`},
    {
    review: book.review
  });
});

regd_users.delete("/auth/review/:isbn", (req,res)=>{
    const username = req.session.username;
    
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

