import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IAdmin extends Document {
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
  verifyPassword(password: string): Promise<boolean>
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

// Hash password before saving
adminSchema.pre('save', async function (this: IAdmin) {
  if (!this.isModified('password')) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
adminSchema.methods.verifyPassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password)
  } catch {
    return false
  }
}

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

export default Admin
