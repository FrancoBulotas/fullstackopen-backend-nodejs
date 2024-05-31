
const personRouter = require('express').Router()
const Person = require('../models/person')

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

personRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons) 
})



personRouter.get('/:id', async (request, response, next) => {
  const person = await Person.findById(request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// personRouter.get('/info', (request, response) => {
//   Person.find({}).then(persons => {
//     response.send(`
//     <p>Phonebook has info for ${persons.length} people</p>
//     <p>${getCurrentDate()}</p>
//   `)
//   })
// })

personRouter.delete('/:id', async (request, response, next) => {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

personRouter.post('/', async (request, response, next) => {
    const body = request.body

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    const savedPerson = await person.save()
    response.status(201).json(savedPerson)

})

personRouter.put('/:id', async (request, response) => {
  const { name, number } = request.body

  response.json(await Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  ))

  // Person.findByIdAndUpdate(request.params.id, 
  //   { name, number },
  //   { new: true, runValidators: true, context: 'query' }
  //   )
  // .then(updatedPerson => {
  //   console.log(updatedPerson)
  //   response.json(updatedPerson)
  // })
  // .catch(error => next(error))
})

module.exports = personRouter