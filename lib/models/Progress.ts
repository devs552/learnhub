import mongoose, { Schema, Document } from 'mongoose'

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  lessonsCompleted: string[] // Array of lesson IDs
  exercisesCompleted: Array<{
    exerciseId: mongoose.Types.ObjectId
    score: number
    completedAt: Date
  }>
  certificateGenerated: boolean
  certificateUrl?: string
  certificateDownloaded: boolean
  certificateDownloadedAt?: Date
  totalScore: number
  createdAt: Date
  updatedAt: Date
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonsCompleted: {
      type: [String],
      default: [],
    },
    exercisesCompleted: [
      {
        exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise' },
        score: { type: Number, min: 0, max: 100 },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
    certificateUrl: String,
    certificateDownloaded: {
      type: Boolean,
      default: false,
    },
    certificateDownloadedAt: Date,
    totalScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Compound index for unique user-course combination
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema)

export default Progress
