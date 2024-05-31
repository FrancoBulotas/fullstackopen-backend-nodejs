
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Person = require('../models/person')


beforeEach(async () => {
    await Person.deleteMany({})

    const personObject = helper.initialPersons.map(person => new Person(person))
    const promiseArray = personObject.map(person => person.save())
    await Promise.all(promiseArray)
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two persons', async () => {
    const response = await api.get('/api/persons')
  
    assert.strictEqual(response.body.length, helper.initialPersons.length)
})

test('a valid person can be added ', async () => {
    const newPerson = {
      name: 'Juansito',
      number: "823174982",
    }
  
    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const personsAtEnd = await helper.personsInDb()
      console.log(personsAtEnd)
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1)

    const contents = personsAtEnd.map(n => n.name)  
    assert(contents.includes('Juansito'))
})


test('person without name is not added', async () => {
    const newPerson = {
      number:"21749821"
    }
  
    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(400)
  
    const peronsAtEnd = await helper.personsInDb()
    assert.strictEqual(peronsAtEnd.length, helper.initialPersons.length)
})

after(async () => {
  await mongoose.connection.close()
})