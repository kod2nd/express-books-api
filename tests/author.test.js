const express = require("express")
const request = require("supertest")
const authorsRouter = require('../routes/authors')
const Author = require('../models/author')

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const appDummy = express()
// Thought process of changing the router export to a function
authorsRouter(appDummy)

let authorObj = {}

const addFakeAuthors = async () => {
    const author1 = new Author({
        name: "Steve",
        age: 42
    })
    const author2 = new Author({
        name: "Nikola",
        age: 23
    })

    authorObj.author1 = await author1.save()
    authorObj.author2 = await author2.save()
}

beforeAll(async () => {
    jest.setTimeout(120000);

    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri);

    await addFakeAuthors()
})

test('GET /authors', async () => {
    const response = await request(appDummy).get('/authors')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)
});

test('Get /authors:id', async () => {
    const response = await request(appDummy).get(`/authors/${authorObj.author1._id}`)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(String(authorObj.author1._id))
});

test('POST /authors', async () => {
    const response = await request(appDummy).post('/authors')
    expect(response.status).toBe(201)
    // Why is the database the Model
    const authorsList = await Author.find()
    expect(authorsList.length).toBe(3)
});

afterAll(() => {
    mongoose.disconnect()
    mongod.stop()
})





