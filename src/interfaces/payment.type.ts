import { Types } from 'mongoose'
import { STATUS_PAYMENTS } from '~/constants/enum'

export interface IPayment {
  _id?: Types.ObjectId
  invoice_id?: Types.ObjectId | string
  transaction_id?: Types.ObjectId | string
  method: string
  amount_paid: number
  status: STATUS_PAYMENTS
  created_at?: string
}
