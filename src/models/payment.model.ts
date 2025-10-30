import { PAYMENT_METHOD, STATUS_PAYMENTS } from '~/constants/enum'
import { IPayment } from '~/interfaces/payment.type'
import mongoose, { Schema } from 'mongoose'

export const paymentSchema = new mongoose.Schema<IPayment>(
  {
    invoice_id: {
      type: Schema.Types.ObjectId,
      ref: 'Invoices',
      required: true
    },
    transaction_id: {
      type: Schema.Types.ObjectId,
      ref: 'Transactions',
      default: null
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD)
    },
    amount_paid: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(STATUS_PAYMENTS),
      default: STATUS_PAYMENTS.FAILED
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
)

export default mongoose.model<IPayment>('Payments', paymentSchema)
