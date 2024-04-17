import mongoose from 'mongoose'

// Conection

const connectionString = process.env.MONGO_DB_URI
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connected!')
  }).catch(err => {
    console.log(err)
  })
