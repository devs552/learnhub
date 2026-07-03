import mongoose, { Schema, Document } from 'mongoose'

export interface IMultipleChoiceExercise {
  type: 'multiple-choice'
  question: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}

export interface ICodeChallengeExercise {
  type: 'code-challenge'
  title: string
  description: string
  initialCode: string
  solution: string
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

export type ExerciseContent = IMultipleChoiceExercise | ICodeChallengeExercise

export interface IExercise extends Document {
  courseId: mongoose.Types.ObjectId
  lessonId: string
  title: string
  content: ExerciseContent
  order: number
  createdAt: Date
  updatedAt: Date
}

const multipleChoiceSchema = new Schema({
  type: { type: String, enum: ['multiple-choice'], required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
})

const codeChallengeSchema = new Schema({
  type: { type: String, enum: ['code-challenge'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  initialCode: { type: String, required: true },
  solution: { type: String, required: true },
  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true },
    },
  ],
})

const exerciseSchema = new Schema<IExercise>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

const Exercise = mongoose.models.Exercise || mongoose.model('Exercise', exerciseSchema)

export default Exercise
