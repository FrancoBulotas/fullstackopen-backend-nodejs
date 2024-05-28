
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(cors())


const Person = require('./models/person')


const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if(parseInt(minutes)<10){
      minutes = '0'+ minutes
    }
    if(parseInt(seconds)<10){
      seconds = '0'+ seconds
    }
    return  `${year}-${month}-${day} // ${hours}:${minutes}:${seconds}`;
}


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  
  
  Person.findById(request.params.id)
  .then(person => {  
    if (person) {
      response.json(person)  
    } 
    else {
        response.status(404).end()  
    }
  })
  .catch(error => {
    console.log(error)
    response.status(500).end()    })
})

app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${getCurrentDate()}</p>
  `)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id).then(person => {
      console.log(person)
      response.json(person)
    })
    // persons = persons.filter(person => person.id !== id)
  
    // response.status(204).end()
})

const generateId = () => {
  const randomValue = Math.random()
  if (randomValue !== 0){
    return Math.floor(randomValue * 10000)
  }
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    }
    // if(persons.find(person => person.name === body.name)){
    //   return response.status(400).json({ 
    //     error: 'name already exists' 
    //     })
    // }
    if (!body.number) {
      return response.status(400).json({ 
      error: 'number missing' 
      })
    }

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})