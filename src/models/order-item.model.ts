import mongoose, { Schema } from 'mongoose'
import { ORDER_ITEM_STATUS } from '~/constants/enum'
import { IOrderItem } from '~/interfaces/order-item.type'

const orderItemSchema = new Schema<IOrderItem>(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: 'Orders',
      required: true
    },
    dish_id: {
      type: Schema.Types.ObjectId,
      ref: 'Dishes',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ORDER_ITEM_STATUS,
      required: true,
      default: ORDER_ITEM_STATUS.PENDING
    },
    note: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: false,
    collection: 'order_items'
  }
)

orderItemSchema.pre('save', function (next) {
  if (!this.subtotal || this.isModified('price') || this.isModified('quantity')) {
    this.subtotal = this.price * this.quantity
  }
  next()
})

export default mongoose.model<IOrderItem>('OrderItem', orderItemSchema)
