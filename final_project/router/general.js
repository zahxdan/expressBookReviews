const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const exist = users.filter((user) =>  user.username === username);
    if (exist.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({messages: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exist!"});
    }
  }
  return res.status(404).json({message: "Unable to register user (Check username/password)."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4 ));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);
  let results = [];

  keys.forEach(key => {
    if (books[key].author === author) {
      results.push(books[key]);
    }
  });
  res.send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);
  let results= [];

  keys.forEach(key => {
    if(books[key].title === title) {
      results.push(books[key]);
    }
  })
  res.send(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

// Task 6: Get book review based on ISBN (Versi Promise untuk Task 11)
public_users.get('/review/:isbn', function (req, res) {
  const getReview = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn].reviews);
    } else {
      reject({ message: "Buku tidak ditemukan" });
    }
  });

  getReview.then(
    (reviews) => res.send(JSON.stringify(reviews, null, 4)),
    (err) => res.status(404).json(err)
  );
});

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const userExists = users.filter((u) => u.username === username);
    if (userExists.length === 0) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(404).json({ message: "User already exists!" });
  }
  return res.status(404).json({ message: "Unable to register user." });
});
