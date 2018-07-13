const express = require('express')
const request = require('supertest')
const bookRouter = require('../routes/books')
const Book = require('../models/book')
const Author = require('../models/author')

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const appDummy = express()
bookRouter(appDummy)

let authorObj = {}

const createFakeAuthor = async (authorName) => {
    const author = new Author({
        name: authorName,
        age: 20
    })
   authorObj[authorName] = await author.save()
}

const createFakeBook = async () => {
    const book1 = new Book({
        title: "Test Book 1",
        author: authorObj["Richard Ashcroft"]
    })
   await book1.save()
}

beforeAll(async () => {
    jest.setTimeout(120000);
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri);
    await createFakeAuthor("Richard Ashcroft")
    await createFakeBook()
})

test('GET /books', async () => {
    const response = await request(appDummy).get('/books')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
});

afterAll(() => {
    mongoose.disconnect()
    mongod.stop()
})

