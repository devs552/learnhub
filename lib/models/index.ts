// lib/models/index.ts
//
// Importing this file (instead of importing individual models directly)
// guarantees every Mongoose model is registered exactly once, in a fixed
// order, before any query runs. This eliminates "Schema hasn't been
// registered for model X" errors that come from .populate() being called
// on a model that no route happened to import yet.
//
// Add every model you create to this list.

import User from './User'
import Course from './Course'
import Exercise from './Exercise'
import Progress from './Progress'
import Admin from './Admin'

export { User, Course, Exercise, Progress, Admin }