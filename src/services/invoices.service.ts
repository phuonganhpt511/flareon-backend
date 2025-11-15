import { ORDER_STATUS, STATUS_INVOICES, TABLE_STATUS } from '~/constants/enum' // ‼️ THÊM TABLE_STATUS
import Invoices from '../models/invoices.model'
import Order from '../models/order.model'
import User from '../models/user.model'
import Table from '../models/table.model'
import OrderItem from '../models/order-item.model'
// ‼️ THÊM IMPORT HÀM CẬP NHẬT BÀN (từ file table.service.ts của bạn)
import { updateStatusTableService } from './table.service'

export const getAllInvoiceService = async () => {
  // ... (code gốc của bạn giữ nguyên)
  try {
    const invoices = await Invoices.find()

    if (!invoices || invoices.length === 0) {
      return {
        success: true,
        message: 'No invoices found',
        data: []
      }
    }

    // Trả kết quả thành công
    return {
      success: true,
      message: 'Get all invoices successfully',
      data: invoices
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Invoices'
    }
  }
}

export const getDetailInvoicesService = async (id: string) => {
  // ... (code gốc của bạn giữ nguyên)
  try {
    const invoice = await Invoices.findById(id)

    if (!invoice) {
      return {
        success: false,
        message: 'Invoice not found'
      }
    }

    const order = await Order.findById(invoice.order_id)
    const order_item = await OrderItem.find({ order_id: order?._id })

    const user = invoice.user_id ? await User.findById(invoice.user_id) : null
    const table = invoice.table_id ? await Table.findById(invoice.table_id) : null

    const invoiceDetail = {
      _id: invoice._id,
      order_id: invoice.order_id,
      user: user ? { id: user._id, name: user.username, email: user.email } : null,
      table: table ? { id: table._id, name: table.table_name } : null,
      total_amount: invoice.total_amount,
      status: invoice.status,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
      order_item: order_item
    }

    return {
      success: true,
      message: 'Get invoice detail successfully',
      data: invoiceDetail
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Invoices'
    }
  }
}

export const createInvoiceService = async (payload: { order_id: string }) => {
  // ... (code gốc của bạn giữ nguyên)
  try {
    const order = await Order.findById(payload.order_id)
    console.log(order)

    if (!order) {
      return {
        success: false,
        message: 'Order not found'
      }
    }
    if (order.status !== ORDER_STATUS.COMPLETED) {
      return {
        success: false,
        message: 'Invoice can only be created when the order is completed'
      }
    }

    const existingInvoice = await Invoices.findOne({ order_id: order._id })
    if (existingInvoice) {
      return { success: false, message: 'Invoice already exists for this order' }
    }

    const newInvoice = new Invoices({
      order_id: order._id,
      user_id: order.user_id,
      table_id: order.table_id,
      total_amount: order.total_price,
      status: STATUS_INVOICES.UNPAID,
      created_at: new Date(),
      updated_at: new Date()
    })

    const savedInvoice = await newInvoice.save()

    return {
      success: true,
      message: 'Invoice created successfully',
      data: savedInvoice

    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Invoices'
    }
  }
}


export const handlePaymentSuccessService = async (orderId: string) => {
  try {
    // Bước A: Cập nhật Hóa đơn (Invoice) thành "Đã thanh toán"
    const updatedInvoice = await Invoices.findOneAndUpdate(
      { order_id: orderId }, // Tìm hóa đơn bằng order_id (chính là txnRef từ VNPay)
      {
        $set: {
          status: STATUS_INVOICES.PAID, // Enum 'paid'
          updated_at: new Date()
        }
      },
      { new: true } // Trả về document đã được cập nhật
    )

    if (!updatedInvoice) {
      return { success: false, message: 'Không tìm thấy hóa đơn để cập nhật' }
    }

    // Bước B: Cập nhật Bàn (Table) về "Còn trống"
    const tableId = updatedInvoice.table_id
    if (tableId) {
      try {
        // Gọi hàm từ table.service đã import ở trên
        await updateStatusTableService(
          tableId.toString(),
          TABLE_STATUS.EMPTY // Enum 'empty'
        )
      } catch (tableError: any) {
        console.error('Lỗi khi cập nhật trạng thái bàn:', tableError.message)
       
      }
    }

    return {
      success: true,
      message: 'Thanh toán thành công. Hóa đơn và Bàn đã được cập nhật.',
      data: updatedInvoice
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Lỗi khi xử lý thanh toán'
    }
  }
}