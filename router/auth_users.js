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


regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username or password is missing" });
  }

  if (authenticatedUser(username, password)) {
    // Store username in session
    req.session.username = username;

    // Generate a JWT token and store it in the session
    const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken: token };

    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});


// Add a book review

regd_users.put("/auth/review/:isbn", (req, res) => {
   console.log("ehfk");
  if (!req.session || !req.session.username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const { isbn } = req.params;
  const { review } = req.query; // Review passed as a query parameter
  const username = req.session.username;

  // Validate if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const book = books[isbn];

  // Initialize reviews object if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }

  // Determine action: Add or Update
  const action = book.reviews[username] ? "updated" : "added";
  book.reviews[username] = review;

  return res.status(200).json({
    message: `Review ${action} successfully`,
    reviews: book.reviews,
  });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (!req.session || !req.session.username) {
    return res.status(401).json({ message: "User not logged in" });
  }
//   console.log("Books object:", books[1]);
  const { isbn } = req.params;
  const username = req.session.username;
//   console.log(isbn);

  const book = books[isbn];

  // Validate if book exists
 if (!book) {
  return res.status(404).json({ message: "Book not found" });
}

if (!book.reviews) {
  return res.status(404).json({ message: "No reviews found for this book" });
}

if (!book.reviews[username]) {
  return res.status(404).json({ message: "No review found to delete" });
}


  delete book.reviews[username]; // Remove the review

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

