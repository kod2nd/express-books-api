const express = require('express');
const router = express.Router();
const Book = require('../models/book')
const Author = require('../models/author')

router.use(express.json())

/* GET books listing. */
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find().populate('author')
    res.json(books);
  } catch (error) {
    next(error)
  }
});

router.get("/:id", async (req, res, next) => {
  const book = await Book.findById(req.params.id)
  res.json(book);
});

router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author
    })
    await newBook.save()
    res.status(201).json({ message: `created new book ${req.body.title}` });
  }

  catch (error) {
    res.json({ message: "Error!!!! HELP SOMEBODY HELPPPPPP! ERror!", errors: error}).status(404)
  }
});

router.put("/:id", (req, res, next) => {
  const toUpdate = Book.findByIdAndUpdate(req.params.id, req.body)
  toUpdate.exec(error => {
    if (error) {
      res.status(404).json({ message: "You have an error!" })
      return
    }
  })
  res.json({ message: `update book with id ${req.params.id}` });
});

router.delete("/:id", async (req, res, next) => {
  const toDel = Book.findByIdAndDelete(req.params.id)
  await toDel.exec()
  res.json({ message: `deleted book with id ${req.params.id}` });
});

module.exports = (app) => {
  app.use('/books', router)
}
