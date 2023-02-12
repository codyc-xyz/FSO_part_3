require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(cors())
app.use(express.static('build'))


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('postData', function (req, res) {
  return JSON.stringify(req.body);
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/api/info', (request, response) =>{
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people. <p>${date}</p>`)
})

app.post('/api/persons', (request, response) => {
  const name = request.body.name
  const number = request.body.number
  const duplicateName = Person.find(person => person.name === name)
  if (name.content === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (duplicateName) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  
  if (number.content === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = {
    id: Math.random() * 10,
    name: name,
    number: number,
    date: new Date()

  }
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const filteredPersons = persons.filter(person => person.id !== id)
  persons = filteredPersons
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
