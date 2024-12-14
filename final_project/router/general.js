const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

   const username = req.body.username;
   const password = req.body.password;
   if(username==null || password == null){
    return res.status(404).json({message:"username or password should not be null"})
   }
   if (!username || !password){
    return res.status(404).json({message:"username or password is missing"})
   }
   if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({username,password})
   
  return res.status(300).json({message: "registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = JSON.stringify(books,null,2);

  return res.status(300).json({message:bookList});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  return res.status(300).json({message:book });
 });
  


 // Get book details based on author
 public_users.get('/author/:author', function (req, res) {
   const author = req.params.author.toLowerCase();  // Get author from request params and convert to lowercase for case-insensitive search
 
   // Filter books by author
   const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(author));
 
   if (booksByAuthor.length > 0) {
     return res.status(200).json({ books: booksByAuthor });
   } else {
     return res.status(404).json({ message: "No books found by this author" });
   }
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const Title = req.params.title.toLowerCase();

  const booksbytitles = Object.values(books).filter(book => book.title.toLowerCase().includes(Title));
  return res.status(300).json({message: booksbytitles});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const id  = req.params.isbn;
  const idBook = books[id];
   
  return res.status(300).json({message: idBook.reviews});
});

module.exports.general = public_users;