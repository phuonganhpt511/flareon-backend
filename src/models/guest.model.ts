import mongoose from 'mongoose'

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    note: { type: String },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'done'], 
      default: 'active'
    }
  },
  { timestamps: true }
)

export default mongoose.model('Guest', guestSchema)
