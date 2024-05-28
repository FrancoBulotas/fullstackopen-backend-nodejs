
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

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)  
    } 
    else {
        response.status(404).end()  
    }
})

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


app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${getCurrentDate()}</p>
  `)
  })

app.get('/', (request, response) => {
    response.send('<h1>Hello World!!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get(`/api/persons/:id`, (request, response) => {
  response.json(persons)  
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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
    if(persons.find(person => person.name === body.name)){
      return response.status(400).json({ 
        error: 'name already exists' 
        })
    }
    if (!body.number) {
      return response.status(400).json({ 
      error: 'number missing' 
      })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})