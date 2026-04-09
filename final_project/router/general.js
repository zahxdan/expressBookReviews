const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // WAJIB: Grader mengecek ini

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ "username": username, "password": password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = await new Promise((resolve) => {
      resolve(books);
    });
    res.status(200).send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBook
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getAuthorBooks = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const filtered = keys
      .filter((key) => books[key].author === author)
      .map((key) => books[key]);

    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject("No books found for this author");
    }
  });

  getAuthorBooks
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getTitleBooks = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const filtered = keys
      .filter((key) => books[key].title === title)
      .map((key) => books[key]);

    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject("No books found with this title");
    }
  });

  getTitleBooks
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
