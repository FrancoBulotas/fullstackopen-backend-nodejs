
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {  
    if (person) {
      response.json(person)  
    } 
    else {
        response.status(404).end()  
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${getCurrentDate()}</p>
  `)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new : true})
  .then(updatedPerson => {
    console.log(updatedPerson)
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})