const express = require("express");
const router = express.Router();
const Author = require('../models/author')
const Book = require('../models/book')

/* GET books listing. */
router.get("/", async (req, res, next) => {
    const authors = await Author.find()
    // res.json({message: "Hello"});
    res.json(authors)
});

router.get("/:id", async (req, res, next) => {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: req.params.id })
    res.json({
        ...author.toJSON(),
        book: books
    });
});

router.post("/", (req, res, next) => {
    const newAuthor = new Author({
        name: req.body.name,
        age: req.body.age
    })

    newAuthor.save()
    res.status(201).json({ message: "Created a new author" })
})

module.exports = (app) => {
    // What is express.json for and how did we know we needed to use it?
    app.use(express.json())
    app.use('/authors', router)
}