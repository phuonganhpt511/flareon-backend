import { Date, Types } from 'mongoose'

export interface IFeedback_Respone {
  _id: Types.ObjectId
  feedback_id?: Types.ObjectId | string
  user_id?: Types.ObjectId | string
  content: string
  createAt: Date
}
