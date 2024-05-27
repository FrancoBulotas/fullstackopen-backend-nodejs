

const express = require('express')
const app = express()

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
    return  `${year}-${month}-${day}`;
}

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${getCurrentDate()}</p>`)
  })

app.get('/', (request, response) => {
    response.send('<h1>Hello World!!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.use(express.json())
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     if (!body.content) {
//         return response.status(400).json({ 
//         error: 'content missing' 
//         })
//     }

//     const person = {
//         name: ,
//         number: ,
//         id: generateId(),
//     }

//     persons = persons.concat(person)

//     response.json(person)
//     })

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})