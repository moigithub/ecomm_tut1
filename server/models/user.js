import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      maxlength: [30, 'cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      validate: [validator.isEmail, 'enter valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [6, 'min 6 characters'],
      select: false
    },
    avatar: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    role: { type: String, required: true, default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  })
}

userSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
  this.resetPasswordExpire = Date.now() * 30 * 60 * 1000 // 30 minutes
  return token
}

export default mongoose.model('User', userSchema)
