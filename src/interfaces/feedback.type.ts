import { Types } from 'mongoose'
import { STATUS_FEEDBACK, TYPE_FEEDBACK } from '~/constants/enum'

export interface IFeedback {
  user_id?: Types.ObjectId | string
  order_id?: Types.ObjectId | string
  dish_id?: Types.ObjectId | string
  type: TYPE_FEEDBACK
  rating: number
  content: string
  image: string
  status: STATUS_FEEDBACK
  created_at?: string
}
