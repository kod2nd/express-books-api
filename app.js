const mongoose = require('mongoose')
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/jumpstart"
mongoose.connect(mongodb_uri)
const db = mongoose.connection
db.on('error', error => {
    console.error('An error occurred!', error)
})

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const index = require("./routes/index");
const books = require("./routes/books");
const authors = require("./routes/authors")

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", index);
books(app)
authors(app)

module.exports = app;
