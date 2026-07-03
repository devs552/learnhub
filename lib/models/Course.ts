import mongoose, { Schema, Document } from 'mongoose'

export interface ILesson {
  _id: string
  title: string
  description: string
  content: string
  order: number
}

export interface ICourse extends Document {
  title: string
  description: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
  lessons: ILesson[]
  createdAt: Date
  updatedAt: Date
}

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
})

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    lessons: {
      type: [lessonSchema],
      default: [],
    },
  },
  { timestamps: true }
)

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema)

export default Course
