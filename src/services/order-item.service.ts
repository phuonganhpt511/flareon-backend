import { ORDER_ITEM_STATUS, ORDER_STATUS } from '~/constants/enum'
import OrderItem from '../models/order-item.model'
import Order from '../models/order.model'

export const getOrderItemService = async (order_id: string) => {
  try {
    const data = await OrderItem.find({ order_id }).populate('dish_id', 'dish_name imageUrl price')

    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'No order items found for this order_id'
      }
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Order Item'
    }
  }
}

export const updateSttOrderItemService = async (id: string, status: ORDER_ITEM_STATUS) => {
  try {
    if (!id) throw new Error('Thiếu order item id')
    if (!status) throw new Error('Thiếu status')
    const orderItem = await OrderItem.findById(id)

    const statusFlow: ORDER_ITEM_STATUS[] = [
      ORDER_ITEM_STATUS.PENDING,
      ORDER_ITEM_STATUS.PROCESSING,
      ORDER_ITEM_STATUS.READY,
      ORDER_ITEM_STATUS.SERVED
    ]

    if (orderItem?.status === ORDER_ITEM_STATUS.CANCELED) {
      return {
        success: false,
        message: 'Canceled order items cannot be updated'
      }
    }

    if (status === ORDER_ITEM_STATUS.CANCELED) {
      orderItem!.status = ORDER_ITEM_STATUS.CANCELED
      await orderItem!.save()
      return {
        success: true,
        message: 'Order item đã được hủy',
        data: orderItem
      }
    }

    const currentIndex = statusFlow.indexOf(orderItem!.status)
    const newIndex = statusFlow.indexOf(status)

    if (newIndex < currentIndex) {
      return {
        success: false,
        message: `Không thể chuyển trạng thái từ ${orderItem!.status} đến ${status}`
      }
    }

    if (newIndex > currentIndex + 1) {
      return {
        success: false,
        message: `Invalid status transition from ${orderItem!.status} to ${status}`
      }
    }

    orderItem!.status = status
    await orderItem!.save()

    const orderId = orderItem?.order_id
    const remaining = await OrderItem.countDocuments({
      order_id: orderId,
      status: { $ne: ORDER_ITEM_STATUS.SERVED }
    })

    if (remaining === 0) {
      await Order.findByIdAndUpdate(orderId, { status: ORDER_STATUS.COMPLETED })
    }

    return {
      success: true,
      message: 'Cập nhật trạng thái order item thành công',
      data: orderItem
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Update Status Order Item'
    }
  }
}

export const getOrderItemsByUserOrTableService = async (user_id?: string, table_id?: string) => {
  try {
    if (!user_id && !table_id) {
      return {
        success: false,
        message: 'Thiếu user_id hoặc table_id'
      }
    }

    let orders: any = []

    // Nếu có user_id thì ưu tiên tìm theo user
    if (user_id) {
      orders = await Order.find({ user_id })
    } else if (table_id) {
      orders = await Order.find({ table_id })
    }

    if (orders.length === 0) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng nào'
      }
    }

    const orderIds = orders.map((o: any) => o._id)

    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } })
      .populate('dish_id', 'dish_name price imageUrl')
      .populate('order_id', 'status table_id user_id')
      .exec()

    return {
      success: true,
      message: 'Lấy danh sách món ăn đã đặt thành công',
      data: orderItems
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách món ăn đã đặt'
    }
  }
}
