
// const mongoose = require('mongoose')
// let showPersons = false
// let addPerson = false

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }
// else if (process.argv.length===3){
//     showPersons = true
// }
// else if (process.argv.length>3){
//     addPerson = true
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://francobulotas:${password}@fullstackopen-ftb.hotzxgx.mongodb.net/appPerson?retryWrites=true&w=majority&appName=fullstackopen-ftb`

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// const nameToAdd = process.argv[3]
// const numberToAdd = process.argv[4]

// const person = new Person({
//     name: nameToAdd,
//     number: numberToAdd,
// })


// if(showPersons){
//     Person.find({}).then(result => {
//         console.log('phonebook:')
//         result.forEach(person => {
//             console.log(person.name, person.number)
//         })
//         mongoose.connection.close()
//     })
// }

// if (addPerson) {
//     person.save().then(result => {
//         console.log(`added ${nameToAdd} number ${numberToAdd} to phonebook`)
//         mongoose.connection.close()
//       })
// }

