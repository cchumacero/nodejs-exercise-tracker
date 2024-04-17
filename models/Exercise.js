import { Schema, model } from 'mongoose'

// SCHEMA
const exerciseSchema = new Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date
})

// MODELS
export const Exercise = model('Exercise', exerciseSchema)
