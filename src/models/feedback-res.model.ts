import mongoose, { Schema } from 'mongoose'
import { IFeedback_Respone } from '~/interfaces/feedback-res.type'

const FeedbackSchema = new mongoose.Schema<IFeedback_Respone>(
  {
    feedback_id: {
      type: Schema.Types.ObjectId,
      ref: 'FeedBacks',
      required: true
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: false
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
)

export default mongoose.model<IFeedback_Respone>('Feedbacks-Respone', FeedbackSchema)
