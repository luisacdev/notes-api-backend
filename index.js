const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')

// Middlewares
app.use(cors())
app.use(express.json())
app.use(logger)

let notes = [
  {
    id: 1,
    title: 'Nota 1',
    body: 'Probando'
  },
  {
    id: 2,
    title: 'Nota 2',
    body: 'Probando'
  },
  {
    id: 3,
    title: 'Nota 3',
    body: 'Probando'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

// Get All
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// Get One
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Create One
app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.title) {
    return response.status(400).json({
      error: 'note.title is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    title: note.title,
    body: note.title
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

// Delete One
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

// 404 - Not found
app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

// Config PORT Heroku
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
