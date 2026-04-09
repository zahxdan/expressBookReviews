const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve) => {
    resolve(books);
  });

  getBooks.then((bookList) => {
    res.send(JSON.stringify(bookList, null, 4));
  });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const getByISBN = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found" });
    }
  });

  getByISBN
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json(err));
});

// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const getByAuthor = new Promise((resolve) => {
    const author = req.params.author;
    const keys = Object.keys(books);
    let filteredBooks = [];
    keys.forEach(key => {
      if (books[key].author === author) {
        filteredBooks.push(books[key]);
      }
    });
    resolve(filteredBooks);
  });

  getByAuthor.then((result) => res.send(JSON.stringify(result, null, 4)));
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const getByTitle = new Promise((resolve) => {
    const title = req.params.title;
    const keys = Object.keys(books);
    let filteredBooks = [];
    keys.forEach(key => {
      if (books[key].title === title) {
        filteredBooks.push(books[key]);
      }
    });
    resolve(filteredBooks);
  });

  getByTitle.then((result) => res.send(JSON.stringify(result, null, 4)));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
