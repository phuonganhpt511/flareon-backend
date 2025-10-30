import { Types } from 'mongoose'
import { STATUS_INVOICES } from '~/constants/enum'

export interface IInvoice {
  _id?: Types.ObjectId
  table_id?: Types.ObjectId | string
  user_id?: Types.ObjectId | string
  order_id?: Types.ObjectId | string
  total_amount: number
  status: STATUS_INVOICES
  created_at?: string
  updated_at?: string
}
