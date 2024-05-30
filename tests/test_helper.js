

const Person = require('../models/person')

const initialPersons = [  
    {    
        name: 'Luquitas',    
        number: '1287389712',  
    },  
    {    
        name: 'Ernesto',    
        number: '218734498217',  
    },
]

const nonExistingId = async () => {
  const person = new Person({ name: 'willremovethissoon' })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map(person => person.toJSON())
}

module.exports = {
    initialPersons, nonExistingId, personsInDb
}