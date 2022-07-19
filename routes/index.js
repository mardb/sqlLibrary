var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
/* GET home page. */
router.get('/', async (req, res, next) => {
  const books = await Book.findAll();
  res.json(books);
  res.redirect('books');
});

module.exports = router;
