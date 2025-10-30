import mongoose, { Schema } from 'mongoose'
import { STATUS_INVOICES } from '~/constants/enum'
import { IInvoice } from '~/interfaces/invoices.type'

export const InvoicesSchema = new mongoose.Schema<IInvoice>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', default: null },
    table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Orders', required: true },
    total_amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: STATUS_INVOICES,
      required: true,
      default: STATUS_INVOICES.UNPAID
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: String,
      default: Date.now
    }
  },
  { versionKey: false }
)

export default mongoose.model<IInvoice>('Invoices', InvoicesSchema)
