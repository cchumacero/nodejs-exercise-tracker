import express, { json } from 'express' // require -> commonJS
// import { usersRouter } from './routes/users.js'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import './database.js'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html')
})

app.use(bodyParser.urlencoded({
  extended: false
}))

// SCHEMAs
const usuarioSchema = new mongoose.Schema({
  username: String
})

const exerciseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date
})

// MODEL
const User = mongoose.model('User', usuarioSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)

app.post('/api/users', (req, res) => {
  const usuarioTemp = req.body.username

  const nuevoUsuario = new User({
    username: usuarioTemp
  })
  nuevoUsuario.save().then(savedUser => {
    res.json(savedUser)
  })
})

app.get('/api/users', (req, res) => {
  User.find().then(data => {
    res.json(data)
  })
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description } = req.body
  const duration = parseInt(req.body.duration)
  const idUsuario = req.params._id
  let date
  if (req.body.date) {
    date = (new Date(req.body.date)).toDateString()
  } else {
    date = (new Date()).toDateString()
  }

  try {
    const user = await User.findById(idUsuario)
    if (!user) {
      res.send('No encontrado!')
    } else {
      const newExercise = new Exercise({
        user_id: user._id,
        description,
        duration,
        date
      })
      newExercise.save().then((savedExercise) => {
        res.json({
          _id: user._id,
          username: user.username,
          description: savedExercise.description,
          duration: savedExercise.duration,
          date: savedExercise.date
        })
      })
    }
  } catch (error) {
    console.log(error)
    res.send('Error guardado ejercicio!')
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query
  const id = req.params._id

  const user = await User.findById(id)

  if (!user) {
    res.send('Usuario no encontrado!')
  }

  let dateObj = {}
  if (from) {
    dateObj.$gte = new Date(from)
  }

  if (to) {
    dateObj.$lte = new Date(to)
  }

  let filter = {
    user_id: id
  }

  if (from || to) {
    filter.date = dateObj
  }

  const exercises = await Exercise.find(filter).limit(+limit ?? 999)
  const log = exercises.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }))
  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log
  })
  /*
  User.findById(req.params._id, (err, user) => {
    if (user) {
      if (from || to || limit) {
        const logs = user.log;
        const logsFiltrados = logs
          .filter(log => {
            const fecha = (new Date(log.date)).toDateString();
            return true;
          });
        const aux = limit ? logsFiltrados.slice(0, limit) : logsFiltrados;
        user.log = aux;
      }
      res.json(user);
    }
  }) */
})

// app.use('/api/users', usersRouter)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
