var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}
// //pasted from index.js
// router.get('/', asyncHandler(async (req, res, next) => {
//   //just added this so comment out and try with res.redirect('/books)
//   Book.findAll().then(function(books){
//     res.render('/books')
//   })
//   // res.redirect('/books')
// }));

// /* GET /books listing. */
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { books, title: 'Books' });
  })
);

//GET - new book form
router.get('/new', asyncHandler(async(req, res) => {
  // const books = await Book.findAll();
  // console.log(books);
  res.render('new-book', { book: {}, title: 'New Book' });
}))

/* POST /books/new - Posts a new book to the database */
router.post(
  '/new',
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      //where should it go? books or books/id?? ahh!!!
      res.redirect('/books/' + book.id);
      // res.redirect('/');
    } catch (err) {
      if (error.name === "SequelizeValidationError") {
        //checking the error
        book = await Book.build(req.body);
        res.render('new-book', {book, errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
    }
  })
);

/* GET /books/:id - Shows book detail form */
router.get('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', {book, title: book.title})
  } else {
    next();
    // res.render('page-not-found',{tile: "Page Not Found"})
  }
}))

/* POST /books/:id - Updates book info in the database */
router.post('/books/:id', asyncHandler(async(req, res) => {
  let book;
  try{
    book = await Book.findByPk(req.params.id);
  if(book){
    await book.update(req.body);
    res.redirect('/books/' + books.id)
  } else {
 res.render('page-not-found', {title: "Page Not Found"});
  }
} catch(error){
  if(error.name === 'SequelizeValidationError'){
    book = await Book.build(req.body);
    book.id = req.params.id; //make sure correct book gets updated
    res.render('update-book', {
      book,
      errors: error.errors,
      title: book.title,
    });
  } else {
    throw error;
  }
}
}))

/* post /books/:id/delete - Deletes an individual book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting */
router.post('/:id/delete', asyncHandler(async(req, res) => {
  let book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect('/')
  } else {
    res.render('page-not-found', {title: "Page Not Found"})
  }
}))


module.exports = router;

// Set up routes
// At the very least, you will need the following routes:
// get / - Home route should redirect to the /books route
// get /books - Shows the full list of books
// get /books/new - Shows the create new book form
// post /books/new - Posts a new book to the database
// get /books/:id - Shows book detail form
// post /books/:id - Updates book info in the database
// post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
