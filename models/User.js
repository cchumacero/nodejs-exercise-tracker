import { Schema, model } from 'mongoose'

// SCHEMAs
const usuarioSchema = new Schema({
  username: String
})

// MODELS
export const User = model('User', usuarioSchema)
