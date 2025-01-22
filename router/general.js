const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/', function (req, res) {
  // Convert the books object to a formatted JSON string
  const formattedBooks = JSON.stringify(books, null, 2);

  // Send the formatted JSON string as the response
  return res.status(200).send(formattedBooks);
});

//get the list of books using promise
public_users.get('/promise', function (req, res) {
  const fetchBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Error fetching books");
    }
  });

  fetchBooks
    .then(bookList => res.status(200).json({ message: bookList }))
    .catch(error => res.status(500).json({ error }));
});
public_users.get('/async',async function(req,res){
    try{
      const response = await axios.get('http://localhost:5000/');
      res.status(202).json({message:response.data.message})
    }catch(error){
       res.status(404).json({message:error})
    }
})


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  return res.status(200).json({message:book });
 });
  
 //getting books by isbn using async await and axios
 public_users.get('/isbn/:isbn/async', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json({ message: response.data.message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
 //getting books by isbn using promise
 public_users.get('/isbn/:isbn/promise', function (req, res) {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      const fetchBooks = new Promise((resolve, reject) => {
        if (response.data.message) {
          resolve(response.data.message);
        } else {
          reject("Books not found");
        }
      });

      fetchBooks
        .then(booklist => res.status(200).json({ message: booklist }))
        .catch(error => res.status(400).json({ message: error }));
    })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
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

 public_users.get('/author/:author/promise', function (req, res) {
    const author = req.params.author.toLowerCase(); // Get author from request params and convert to lowercase for case-insensitive search
    
    const fetchBooksByAuthor = new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).
      filter(book => book.author.toLowerCase().includes(author));
  
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    });
  
    fetchBooksByAuthor
      .then(booksByAuthor => res.status(200).json({ books: booksByAuthor }))
      .catch(error => res.status(404).json({ message: error }));
  });
  
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const Title = req.params.title.toLowerCase();

  const booksbytitles = Object.values(books).filter(book => book.title.toLowerCase().includes(Title));
  return res.status(300).json({message: booksbytitles});
});

public_users.get('/title/:title/promise', function (req, res) {
    const title = req.params.title.toLowerCase(); // Get title from request params and convert to lowercase for case-insensitive search
    
    const fetchBooksByTitle = new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.
        title.toLowerCase().includes(title));
  
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });
  
    fetchBooksByTitle
      .then(booksByTitle => res.status(200).json({ books: booksByTitle }))
      .catch(error => res.status(404).json({ message: error }));
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const id  = req.params.isbn;
  const idBook = books[id];
   
  return res.status(300).json({message: idBook.reviews});
});

module.exports.general = public_users;