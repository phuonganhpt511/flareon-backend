import { Types } from 'mongoose'
import { ORDER_ITEM_STATUS } from '~/constants/enum'
import { IDishes } from '~/interfaces/dish.type'

export interface IOrderItem {
  _id?: Types.ObjectId
  order_id: Types.ObjectId
  dish_id: Types.ObjectId | IDishes
  quantity: number
  price: number
  subtotal: number
  status: ORDER_ITEM_STATUS
  note?: string
}
