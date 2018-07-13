const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Author = require('./author')

// Create Schema
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        validate: {
            validator(authorID){
                return Author.findById(authorID)
            }
        }
    }
})

// create model from schema
const Book = mongoose.model('Book', bookSchema)

module.exports = Book