import mongoose from 'mongoose'
// Register Mongoose models (side-effect). Some projects don't provide type
// declarations for this module; suppress the TS error and require it at runtime.
// @ts-ignore: side-effect import has no type declarations
require('./models') // registers every Mongoose model (User, Course, Exercise, Progress) exactly once, before any query runs — fixes "Schema hasn't been registered for model X" errors from .populate()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform'

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log('[v0] MongoDB connected successfully')
  } catch (error) {
    console.error('[v0] MongoDB connection error:', error)
    throw error
  }
}

export async function disconnectDB() {
  if (!isConnected) {
    return
  }

  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('[v0] MongoDB disconnected')
  } catch (error) {
    console.error('[v0] MongoDB disconnection error:', error)
    throw error
  }
}